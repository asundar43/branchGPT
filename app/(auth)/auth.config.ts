import type { NextAuthConfig } from 'next-auth';
import { hasActiveSubscription, checkFreeTrialStatus } from '@/lib/db/queries';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/pricing',
    error: '/pricing',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      console.log('Authorized callback:', { 
        isLoggedIn: !!auth?.user,
        pathname: nextUrl.pathname,
        userId: auth?.user?.id 
      });

      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/chat');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');
      const isOnLanding = nextUrl.pathname === '/';
      const isOnPricing = nextUrl.pathname === '/pricing';
      const isOnFreeTrial = nextUrl.pathname.startsWith('/api/free-trial');
      const isOnAuthCallback = nextUrl.pathname.startsWith('/api/auth/callback');

      // Allow access to landing page
      if (isOnLanding) return true;

      // Allow access to free trial API endpoint for logged-in users
      if (isOnFreeTrial && isLoggedIn) return true;

      // Allow auth callbacks for credential provider
      if (isOnAuthCallback) return true;

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/chat', nextUrl));
      }

      // Allow access to auth pages for non-logged-in users
      if (isOnAuth) return true;

      // Protect dashboard routes
      if (isOnDashboard) {
        if (!isLoggedIn || !auth?.user?.id) {
          return Response.redirect(new URL('/auth/login', nextUrl));
        }
        
        // Check subscription status for logged-in users
        try {
          const hasSubscription = await hasActiveSubscription(auth.user.id);
          if (!hasSubscription) {
            const trialStatus = await checkFreeTrialStatus(auth.user.id);
            if (!trialStatus.isActive) {
              return Response.redirect(new URL('/pricing', nextUrl));
            }
          }
          return true;
        } catch (error) {
          console.error('Error checking subscription:', error);
          return Response.redirect(new URL('/pricing', nextUrl));
        }
      }

      // Allow access to pricing page for everyone
      if (isOnPricing) {
        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
