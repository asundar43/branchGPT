import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { hasActiveSubscription } from '@/lib/db/queries';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/chat/:path*',
    '/api/chat/:path*',
    '/settings/:path*',
    
    // Exclude the following routes from authentication:
    // '/' - Landing page
    // '/auth/login' - Login page
    // '/auth/register' - Registration page
    // Add other protected routes here, but NOT the landing page
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add CSP headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com https://www.branchgpt.org;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    connect-src 'self' https://api.stripe.com https://r.stripe.com https://www.branchgpt.org https://va.vercel-scripts.com;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // Continue with existing middleware logic
  if (request.nextUrl.pathname.startsWith('/chat')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const hasSubscription = await hasActiveSubscription(token.sub as string);
    if (!hasSubscription) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  return response;
}
