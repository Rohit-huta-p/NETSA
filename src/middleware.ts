
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user-token');
  const { pathname } = request.nextUrl;

  // Allow all API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const protectedRoutes = ['/events', '/opportunities', '/workshops', '/artist'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isRoot = pathname === '/';

  // If trying to access a protected route without a token, redirect to login.
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in, and trying to access login or the root, redirect to events page.
  // We allow access to /register even if logged in, in case they want to create a different type of account.
  if ((pathname.startsWith('/login') || isRoot) && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/events';
    return NextResponse.redirect(url);
  }

  // If on the root page and not logged in, show the public landing page.
  if(isRoot && !token){
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
