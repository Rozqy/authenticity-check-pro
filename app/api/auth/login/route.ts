import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '../../../../lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@acp.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if it's an admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        const token = generateToken({ email, isAdmin: true });
        
        const response = NextResponse.json({
          success: true,
          message: 'Login successful',
          token,
          userType: 'admin',
        });

        // Set cookie
        response.cookies.set('adminToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      } catch (tokenError: any) {
        console.error('Token generation error:', tokenError);
        return NextResponse.json(
          { error: 'Failed to generate authentication token', message: tokenError.message },
          { status: 500 }
        );
      }
    }

    // TODO: Add user authentication here when user system is implemented
    // For now, if it's not admin, return invalid credentials
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
