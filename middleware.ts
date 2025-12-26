import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect /admin/drafts and /admin/draft routes
  if (pathname.startsWith('/admin/drafts') || pathname.startsWith('/admin/draft')) {
    const authCookie = request.cookies.get('admin_auth');
    
    if (authCookie?.value !== 'authenticated') {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/drafts/:path*', '/admin/draft/:path*'],
};
