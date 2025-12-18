import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import FakePattern from '../../../../models/FakePattern';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const patterns = await FakePattern.find({}).populate('brand_id');
    return NextResponse.json({ success: true, patterns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const pattern = await FakePattern.create(body);
    return NextResponse.json({ success: true, pattern });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




