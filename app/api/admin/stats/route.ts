import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import VerificationLog from '../../../models/VerificationLog';
import Brand from '../../../models/Brand';

export async function GET(request: NextRequest) {
  try {
    // Simple auth check
    const token = request.cookies.get('adminToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const totalVerifications = await VerificationLog.countDocuments();
    const brandUpdates = await Brand.countDocuments();
    const systemAlerts = await VerificationLog.countDocuments({ result: 'fake' });
    const pendingVerifications = await VerificationLog.countDocuments({ result: 'pending' });

    return NextResponse.json({
      success: true,
      totalVerifications,
      brandUpdates,
      systemAlerts,
      pendingVerifications,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

