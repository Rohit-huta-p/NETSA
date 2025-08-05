
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user-token');
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/events', '/opportunities', '/workshops', '/artist'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If the user is trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is authenticated and tries to access login, register, or the root, redirect to events
  if ((pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') && token) {
     return NextResponse.redirect(new URL('/events', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/events/:path*', '/opportunities/:path*', '/workshops/:path*', '/artist/:path*', '/login', '/register', '/'],
}
