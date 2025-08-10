
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of routes that require authentication
const protectedRoutes = ['/events', '/gigs', '/workshops', '/artist', '/create'];

// List of API routes that require authentication
const protectedApiRoutes = ['/api/gigs'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- API Route Protection ---
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  if (isProtectedApiRoute) {
      const authHeader = request.headers.get('Authorization');
      // The middleware's job is just to check for the presence of the header.
      // The API route itself will handle the verification.
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({ message: 'Unauthorized: No or invalid token format' }, { status: 401 });
      }
      return NextResponse.next();
  }

  // --- Page Route Protection ---
  const tokenCookie = request.cookies.get('user-token');
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isRoot = pathname === '/';

  // If trying to access a protected route without a token, redirect to login.
  if (isProtectedRoute && !tokenCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in, and trying to access login or the root, redirect to events page.
  if ((isAuthRoute || isRoot) && tokenCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/events';
    return NextResponse.redirect(url);
  }

  // If on the root page and not logged in, allow access to the public landing page.
  if(isRoot && !tokenCookie){
    return NextResponse.next();
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (for images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
}
