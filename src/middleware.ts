
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of page routes that require a user to be logged in
const protectedPageRoutes = ['/events', '/gigs', '/workshops', '/artist', '/create'];

// List of API routes that require a valid Authorization token
const protectedApiRoutes = ['/api/gigs'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware: Processing request for ${pathname}`);

  // --- API Route Protection ---
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  if (isProtectedApiRoute) {
      console.log(`Middleware: Path ${pathname} is a protected API route.`);
      const authHeader = request.headers.get('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          console.error(`Middleware: API request to ${pathname} is missing or has an invalid Authorization header.`);
          return NextResponse.json({ message: 'Unauthorized: No or invalid token format provided.' }, { status: 401 });
      }
      
      console.log(`Middleware: API request to ${pathname} has an Authorization header. Allowing request to proceed to API handler for verification.`);
      // The API route itself will handle the actual verification of the token.
      return NextResponse.next();
  }

  // --- Page Route Protection ---
  console.log(`Middleware: Path ${pathname} is a page route. Checking cookie...`);
  const tokenCookie = request.cookies.get('user-token');
  const isProtectedRoute = protectedPageRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isRoot = pathname === '/';

  // If trying to access a protected page without a token, redirect to login.
  if (isProtectedRoute && !tokenCookie) {
    console.log(`Middleware: No token cookie found for protected page ${pathname}. Redirecting to /login.`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in (has token) and trying to access login, register, or the root, redirect to events page.
  if ((isAuthRoute || isRoot) && tokenCookie) {
    console.log(`Middleware: User is logged in. Redirecting from ${pathname} to /events.`);
    const url = request.nextUrl.clone();
    url.pathname = '/events';
    return NextResponse.redirect(url);
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
     * - assets (for images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
}

    