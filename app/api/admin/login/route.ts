import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '../../../lib/auth';
import { generateToken } from '../../../lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@acp.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// In production, store hashed password in database
// For now, using environment variable
const ADMIN_PASSWORD_HASH = '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq';

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

    // Debug logging (remove in production)
    console.log('Login attempt:', { email, expectedEmail: ADMIN_EMAIL });

    // Simple authentication (in production, use database)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        const token = generateToken({ email, isAdmin: true });
        
        const response = NextResponse.json({
          success: true,
          message: 'Login successful',
          token,
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

    return NextResponse.json(
      { error: 'Invalid credentials' },
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




