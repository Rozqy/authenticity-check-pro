import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import VerificationLog from '../../../models/VerificationLog';
import Brand from '../../../models/Brand';
import ProductCodePattern from '../../../models/ProductCodePattern';
import FakePattern from '../../../models/FakePattern';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Get optional brand and codes from form data
    const brand = formData.get('brand') as string | null;
    const batchNumber = formData.get('batchNumber') as string | null;
    const serialNumber = formData.get('serialNumber') as string | null;
    const barcode = formData.get('barcode') as string | null;
    const manufacturingDate = formData.get('manufacturingDate') as string | null;

    const imageCount = files.length;
    let score = 50; // Base score for image verification
    let result: 'verified' | 'fake' | 'pending' = 'pending';
    let codeVerificationResult: 'verified' | 'fake' | 'pending' | null = null;
    let matchedPattern = false;

    // If codes are provided, use code verification logic
    if (brand && batchNumber && serialNumber && barcode) {
      const brandDoc = await Brand.findOne({ name: brand });
      const brandId = brandDoc?._id;

      if (brandId) {
        const combinedCode = `${batchNumber}-${serialNumber}-${barcode}`;
        const genuinePatterns = await ProductCodePattern.find({ brand_id: brandId });
        const fakePatterns = await FakePattern.find({ brand_id: brandId });

        // Helper function to test pattern match
        const testPattern = (patternStr: string, testValue: string): boolean => {
          try {
            if (patternStr.startsWith('^') || patternStr.includes('[') || patternStr.includes('(') || 
                patternStr.includes('*') || patternStr.includes('+') || patternStr.includes('?')) {
              const regex = new RegExp(patternStr);
              return regex.test(testValue);
            }
            if (testValue === patternStr) return true;
            if (testValue.includes(patternStr) || patternStr.includes(testValue)) return true;
            return false;
          } catch (e) {
            return testValue.includes(patternStr) || patternStr.includes(testValue);
          }
        };

        // Check fake patterns first
        for (const pattern of fakePatterns) {
          const testValues = [combinedCode, batchNumber, serialNumber, barcode];
          for (const testValue of testValues) {
            if (testPattern(pattern.pattern, testValue)) {
              codeVerificationResult = 'fake';
              score = 20; // Low score for fake (same as code verification)
              matchedPattern = true;
              break;
            }
          }
          if (codeVerificationResult === 'fake') break;
        }

        // Check genuine patterns if not fake
        if (codeVerificationResult !== 'fake') {
          for (const pattern of genuinePatterns) {
            const testValues = [combinedCode, batchNumber, serialNumber, barcode];
            for (const testValue of testValues) {
              if (testPattern(pattern.pattern, testValue)) {
                codeVerificationResult = 'verified';
                score = 85; // High score for verified codes
                matchedPattern = true;
                break;
              }
            }
            if (codeVerificationResult === 'verified') break;
          }
        }

        if (!matchedPattern && codeVerificationResult === null) {
          codeVerificationResult = 'pending';
        }
      }
    }

    // Image-based fake detection (check for suspicious patterns even without codes)
    let imageFakeIndicators = 0;
    let imageGenuineIndicators = 0;
    
    // If brand is selected, check for common fake indicators
    if (brand) {
      const brandDoc = await Brand.findOne({ name: brand });
      if (brandDoc) {
        // Get fake patterns for this brand to check against
        const fakePatterns = await FakePattern.find({ brand_id: brandDoc._id });
        
        // Simulate checking image for fake indicators
        // In production, this would use OCR/AI to extract text from images
        // For now, we'll use heuristics based on what we know about fakes
        
        // Common fake indicators (would be detected by AI/OCR in production):
        // - Poor quality printing
        // - Misspelled brand names
        // - Wrong fonts/logos
        // - Suspicious batch codes visible in image
        // - Missing holographic seals
        // - Poor packaging quality
        
        // Since we can't actually analyze images yet, we'll be conservative
        // If no codes are provided, we can't verify authenticity, so default to pending
        // But if codes ARE provided and match fake patterns, we catch it above
        
        // For image-only: Without codes, we can't definitively say it's fake or genuine
        // So we use a conservative approach
        if (!batchNumber && !serialNumber && !barcode) {
          // No codes provided - can't verify, use conservative scoring
          imageFakeIndicators = 0;
          imageGenuineIndicators = 0;
        }
      }
    }

    // Image quality analysis (simulated - in production, use AI/ML)
    let imageScore = 0;
    if (imageCount >= 3) {
      imageScore += 15; // More images = better analysis
    } else if (imageCount >= 2) {
      imageScore += 10;
    } else {
      imageScore += 5; // Single image
    }

    // Additional points if brand is selected (even without codes)
    let brandBonus = 0;
    if (brand) {
      const brandDoc = await Brand.findOne({ name: brand });
      if (brandDoc) {
        brandBonus = 5; // Small bonus for selecting a known brand
      }
    }

    // Combine code verification with image analysis
    if (codeVerificationResult) {
      // Code verification takes priority - this is the most reliable
      result = codeVerificationResult;
      if (result === 'verified') {
        score = Math.min(100, score + imageScore + brandBonus); // Boost verified with good images
      } else if (result === 'fake') {
        score = Math.max(15, score - 10); // Low score for fake (15-25 range)
      } else {
        score = 35 + imageScore + brandBonus; // Pending with image bonus
      }
    } else {
      // Image-only analysis - BE CONSERVATIVE (can't verify without codes)
      // Without codes, we can't definitively say it's genuine or fake
      // So we use a neutral/pending score
      
      if (imageFakeIndicators > 0) {
        // If we detect fake indicators, mark as suspicious
        result = 'pending';
        score = 30 + imageScore; // Low score for suspicious items
      } else {
        // No fake indicators, but also no verification - default to pending
        result = 'pending';
        // Conservative scoring: 40-55 range (not high enough to be "verified")
        score = 40 + imageScore + brandBonus;
        
        // Cap at 55 to ensure it's clearly "pending" not "verified"
        if (score > 55) {
          score = 55;
        }
      }
    }

    // Store image URLs (in production, upload to Cloudinary)
    const imageUrls: string[] = [];
    // For now, we'll just store placeholder URLs
    files.forEach((file, index) => {
      imageUrls.push(`/uploads/${Date.now()}-${index}-${file.name}`);
    });

    // Log verification
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    await VerificationLog.create({
      method: 'image',
      brand: brand || undefined,
      score: Math.round(score),
      result,
      ip: clientIp,
      details: {
        imageCount,
        imageUrls,
        batchNumber: batchNumber || undefined,
        serialNumber: serialNumber || undefined,
        barcode: barcode || undefined,
        manufacturingDate: manufacturingDate || undefined,
        codeVerification: codeVerificationResult || undefined,
        analysis: {
          logoDetected: brand ? true : undefined,
          textQuality: 'good',
          packagingQuality: 'high',
          hasCodeVerification: !!codeVerificationResult,
        },
      },
    });

    let message = 'Verification pending';
    if (result === 'verified') {
      message = codeVerificationResult === 'verified' 
        ? 'Product appears to be authentic based on code and image analysis'
        : 'Product appears to be authentic based on image analysis';
    } else if (result === 'fake') {
      message = '⚠️ PRODUCT DETECTED AS FAKE - Codes match known counterfeit patterns. Do not purchase.';
    } else {
      if (codeVerificationResult === 'pending' && brand && batchNumber) {
        message = 'Codes provided but do not match known patterns - manual review recommended';
      } else if (brand && !batchNumber) {
        message = `⚠️ Image-only verification for ${brand} cannot confirm authenticity. Enter batch number, serial number, and barcode from the product for accurate fake detection.`;
      } else if (!brand) {
        message = '⚠️ Cannot verify authenticity from image alone. Select the brand and enter product codes (batch number, serial number, barcode) visible in the image for fake detection.';
      } else {
        message = '⚠️ Image analysis cannot definitively verify authenticity. Add product codes for accurate fake detection.';
      }
    }

    return NextResponse.json({
      success: true,
      result,
      score: Math.min(100, Math.max(0, Math.round(score))),
      message,
      imageCount,
      codeVerification: codeVerificationResult,
      brand: brand || undefined,
    });
  } catch (error: any) {
    console.error('Image verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}




