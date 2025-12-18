import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Brand from '../../models/Brand';

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, brands });
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    // Return empty array instead of error so pages can still load
    return NextResponse.json({ success: true, brands: [] });
  }
}




