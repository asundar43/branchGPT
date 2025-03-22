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

  const token = await getToken({ req: request });
  const { pathname, searchParams } = request.nextUrl;
  
  // Handle post-subscription success redirect
  if (pathname === '/chat' && searchParams.get('success') === 'true') {
    if (!token) {
      // Store the intended destination
      const callbackUrl = new URL('/chat', request.url).toString();
      const signinUrl = new URL('/login', request.url);
      signinUrl.searchParams.set('callbackUrl', callbackUrl);
      return NextResponse.redirect(signinUrl);
    }
    return response; // Allow through to chat after successful subscription
  }

  // Protected routes check
  if (pathname.startsWith('/chat') || pathname.startsWith('/api/chat') || pathname.startsWith('/settings')) {
    if (!token) {
      // Store the intended destination
      const callbackUrl = new URL(request.url).toString();
      const signinUrl = new URL('/login', request.url);
      signinUrl.searchParams.set('callbackUrl', callbackUrl);
      return NextResponse.redirect(signinUrl);
    }

    // For chat routes, check subscription
    if (pathname.startsWith('/chat') || pathname.startsWith('/api/chat')) {
      try {
        const hasSubscription = await hasActiveSubscription(token.sub as string);
        if (!hasSubscription) {
          // User logged in but no subscription - redirect to pricing
          return NextResponse.redirect(new URL('/pricing', request.url));
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        return response; // Allow access on error to prevent loops
      }
    }
  }

  return response;
}
