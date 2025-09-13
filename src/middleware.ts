
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/settings', '/create', '/dashboard']; 
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('user-token');
  
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !tokenCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl);
  }

  if (tokenCookie && authRoutes.some(route => pathname.startsWith(route))) {
    // This part is tricky without knowing the role from the cookie directly.
    // The client-side redirect in the login/registration forms is more reliable.
    // For now, we can default to a general page.
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
