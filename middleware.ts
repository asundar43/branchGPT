import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export const config = {
  matcher: [
    '/chat/:path*',
    '/api/chat/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Must be authenticated to access chat
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = NextResponse.next();

  // Add CSP headers with broader permissions for required services
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.vercel.com https://*.vercel-scripts.com https://*.vercel-insights.com https://*.vercel-analytics.com https://*.branchgpt.org https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: https://*.stripe.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.stripe.com https://*.vercel.com https://*.vercel-scripts.com https://*.vercel-insights.com https://*.vercel-analytics.com https://*.branchgpt.org wss://*.vercel.com https://va.vercel-scripts.com https://r.stripe.com",
    "frame-src 'self' https://*.stripe.com",
    "media-src 'self'",
    "form-action 'self' https://*.stripe.com",
    "child-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "base-uri 'self'",
  ].join('; '));

  return response;
}
