
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user-token');
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/events', '/opportunities', '/workshops', '/artist'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // If trying to access a protected route without a token, redirect to login.
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in, and trying to access login/register, redirect to events page.
  // The root path '/' for logged-in users should also redirect to '/events'.
  if ((isAuthRoute || pathname === '/') && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/events';
    return NextResponse.redirect(url);
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
