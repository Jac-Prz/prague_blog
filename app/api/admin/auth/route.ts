import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, clearRateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit (5 attempts per 15 minutes)
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil((rateCheck.resetAt! - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${minutesLeft} minutes.` },
        { status: 429 }
      );
    }
    
    const { password } = await request.json();
    
    // Get admin password from environment
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }
    
    // Password check - support both plain text (for backward compatibility) and hashed
    let isValid = false;
    if (ADMIN_PASSWORD.startsWith('$2a$') || ADMIN_PASSWORD.startsWith('$2b$')) {
      // Hashed password (bcrypt)
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD);
    } else {
      // Plain text password (backward compatibility)
      isValid = password === ADMIN_PASSWORD;
    }
    
    if (isValid) {
      // Clear rate limit on successful login
      clearRateLimit(ip);
      
      // Set a secure cookie for authentication
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days (longer session)
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('admin_auth');
  
  if (authCookie?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
