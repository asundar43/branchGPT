import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { hasActiveSubscription } from '@/lib/db/queries';

export const config = {
  matcher: [
    '/chat/:path*',
    '/api/chat/:path*',
    '/settings/:path*',
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

  if (!process.env.AUTH_SECRET) {
    console.error('AUTH_SECRET is not set');
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET
  });
  
  const { pathname } = request.nextUrl;
  
  // Check subscription for chat routes
  if (pathname.startsWith('/chat') || pathname.startsWith('/api/chat')) {
    // If not authenticated, let NextAuth handle the redirect
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check subscription status for all authenticated users
    try {
      const hasSubscription = await hasActiveSubscription(token.sub as string);
      if (!hasSubscription) {
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      // On error, redirect to pricing to be safe
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  return response;
}
