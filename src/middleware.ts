
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/settings', '/create']; 
const authRoutes = ['/login', '/register'];
const publicRoutes = ['/', '/events', '/gigs']; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('user-token');
  
  // If user is NOT logged in and tries to access a protected page
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !tokenCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl);
  }

  // If user IS logged in and tries to access an auth page (login/register)
  if (tokenCookie && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/events', request.url));
  }
  
  return NextResponse.next();
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
