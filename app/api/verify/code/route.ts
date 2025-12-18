import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import VerificationLog from '../../../models/VerificationLog';
import ProductCodePattern from '../../../models/ProductCodePattern';
import FakePattern from '../../../models/FakePattern';
import Brand from '../../../models/Brand';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { brand, batchNumber, serialNumber, barcode, manufacturingDate } = body;

    if (!brand || !batchNumber || !serialNumber || !barcode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find brand by name
    const brandDoc = await Brand.findOne({ name: brand });
    const brandId = brandDoc?._id;

    // Combine all codes for pattern matching
    const combinedCode = `${batchNumber}-${serialNumber}-${barcode}`;

    // Check against genuine patterns
    const genuinePatterns = brandId 
      ? await ProductCodePattern.find({ brand_id: brandId })
      : [];
    const fakePatterns = brandId
      ? await FakePattern.find({ brand_id: brandId })
      : [];

    let score = 0; // Start with 0 - must earn points
    let result: 'verified' | 'fake' | 'pending' = 'pending';
    let matchedPattern = false;
    let matchedGenuinePattern = false;

    // Helper function to test pattern match (supports regex and exact matches)
    const testPattern = (patternStr: string, testValue: string): boolean => {
      try {
        // Check if pattern is a regex (starts with ^ or contains regex characters)
        if (patternStr.startsWith('^') || patternStr.includes('[') || patternStr.includes('(') || patternStr.includes('*') || patternStr.includes('+') || patternStr.includes('?')) {
          const regex = new RegExp(patternStr);
          return regex.test(testValue);
        }
        // Exact match
        if (testValue === patternStr) return true;
        // Substring match
        if (testValue.includes(patternStr) || patternStr.includes(testValue)) return true;
        return false;
      } catch (e) {
        // If regex fails, fall back to substring
        return testValue.includes(patternStr) || patternStr.includes(testValue);
      }
    };

    // Check fake patterns first (higher priority)
    for (const pattern of fakePatterns) {
      // Test against all code components
      const testValues = [combinedCode, batchNumber, serialNumber, barcode];
      for (const testValue of testValues) {
        if (testPattern(pattern.pattern, testValue)) {
          score = 20;
          result = 'fake';
          matchedPattern = true;
          break;
        }
      }
      if (result === 'fake') break;
    }

    // Only check genuine patterns if not already marked as fake
    if (result !== 'fake') {
      for (const pattern of genuinePatterns) {
        // Test against all code components
        const testValues = [combinedCode, batchNumber, serialNumber, barcode];
        for (const testValue of testValues) {
          if (testPattern(pattern.pattern, testValue)) {
            score = 90;
            matchedGenuinePattern = true;
            matchedPattern = true;
            break;
          }
        }
        if (matchedGenuinePattern) break;
      }
    }

    // If no pattern matched at all, use conservative heuristics
    if (!matchedPattern) {
      // Basic format validation (only gives small points)
      if (batchNumber.length >= 4 && serialNumber.length >= 6 && barcode.length >= 8) {
        score = 40; // Low score for format only
      } else {
        score = 30; // Very low score for invalid format
      }
      
      // Check date validity (small bonus)
      if (manufacturingDate) {
        const mfgDate = new Date(manufacturingDate);
        const today = new Date();
        if (mfgDate <= today && mfgDate >= new Date('2020-01-01')) {
          score += 10;
        }
      }
      
      // Without pattern match, default to pending
      result = 'pending';
    } else if (matchedGenuinePattern) {
      // Only mark as verified if we matched a genuine pattern
      result = 'verified';
    }

    // Final safety check - don't verify without pattern match
    if (result === 'verified' && !matchedGenuinePattern) {
      result = 'pending';
      score = Math.min(score, 60);
    }

    // Log verification
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    await VerificationLog.create({
      method: 'code',
      brand,
      score,
      result,
      ip: clientIp,
      details: {
        batchNumber,
        serialNumber,
        barcode,
        manufacturingDate,
        productCode: combinedCode,
      },
    });

    return NextResponse.json({
      success: true,
      result,
      score: Math.min(100, Math.max(0, score)),
      message: result === 'verified' ? 'Product appears to be authentic' : result === 'fake' ? 'Product may be counterfeit' : 'Verification pending',
      brand: brandDoc?.name || brand,
      matchedPattern,
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

