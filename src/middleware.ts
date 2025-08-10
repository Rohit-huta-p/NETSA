
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPageRoutes = ['/events', '/gigs', '/workshops', '/artist', '/create'];
const protectedApiRoutes = ['/api/gigs', '/api/events'];
const authRoutes = ['/login', '/register'];
const publicRoutes = ['/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('user-token');
  
  console.log(`Middleware: Processing request for ${pathname}`);

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    console.log(`Middleware: Path ${pathname} is an API route.`);
    
    // Check if it's a protected API route
    const isProtectedRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
    if (!isProtectedRoute) {
        console.log(`Middleware: API route ${pathname} is not protected. Allowing.`);
        return NextResponse.next();
    }

    // For protected API routes, check for Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error(`Middleware: API request to ${pathname} is missing or has an invalid Authorization header. Blocking.`);
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized: No or invalid token provided.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Middleware: API request to ${pathname} has an Authorization header. Allowing request to proceed to API handler for verification.`);
    // The actual token verification will happen in the API route handler
    return NextResponse.next();
  }

  // Handle page routes
  console.log(`Middleware: Path ${pathname} is a page route.`);
  const isProtectedRoute = protectedPageRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If user is not logged in and tries to access a protected page, redirect to login
  if (isProtectedRoute && !tokenCookie) {
    console.log(`Middleware: No token for protected page ${pathname}. Redirecting to /login.`);
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access an auth page or the root, redirect to events
  if (tokenCookie && (isAuthRoute || publicRoutes.includes(pathname))) {
    console.log(`Middleware: Logged-in user accessing auth/public page ${pathname}. Redirecting to /events.`);
    return NextResponse.redirect(new URL('/events', request.url));
  }

  console.log(`Middleware: Request for ${pathname} passed all checks. Allowing access.`);
  return NextResponse.next();
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
