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
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/chat');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');
      const isOnLanding = nextUrl.pathname === '/';
      const isOnPricing = nextUrl.pathname === '/pricing';
      const isOnFreeTrial = nextUrl.pathname.startsWith('/api/free-trial');

      // Allow access to landing page
      if (isOnLanding) return true;

      // Allow access to free trial API endpoint for logged-in users
      if (isOnFreeTrial && isLoggedIn) return true;

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isOnAuth && auth.user?.id) {
        // Check if user has active subscription or trial
        try {
          const hasSubscription = await hasActiveSubscription(auth.user.id);
          if (hasSubscription) {
            return Response.redirect(new URL('/chat', nextUrl));
          }
          const trialStatus = await checkFreeTrialStatus(auth.user.id);
          if (trialStatus.isActive) {
            return Response.redirect(new URL('/chat', nextUrl));
          }
          return Response.redirect(new URL('/pricing', nextUrl));
        } catch (error) {
          console.error('Error checking subscription:', error);
          return Response.redirect(new URL('/pricing', nextUrl));
        }
      }

      // Allow access to auth pages for non-logged-in users
      if (isOnAuth) return true;

      // Protect dashboard routes
      if (isOnDashboard) {
        if (!isLoggedIn || !auth.user?.id) {
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

      // Allow access to pricing page for logged-in users
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
