import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { hasActiveSubscription } from '@/lib/db/queries';

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

export async function middleware(request: Request) {
  const session = await auth();
  
  // Allow access to public routes
  if (!session?.user?.id) {
    return NextResponse.next();
  }

  // Check subscription for protected routes
  const url = new URL(request.url);
  if (url.pathname.startsWith('/chat') || 
      url.pathname.startsWith('/api/chat')) {
    try {
      const hasSubscription = await hasActiveSubscription(session.user.id);
      if (!hasSubscription) {
        return NextResponse.redirect(new URL('/pricing', url.origin));
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      // If there's an error checking subscription, allow access to prevent infinite redirects
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}
