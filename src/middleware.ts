
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('user-token');
  const { pathname } = request.nextUrl;

  // If the user is trying to access a protected route without a token, redirect to login
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is authenticated and tries to access login or register, redirect to dashboard
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
