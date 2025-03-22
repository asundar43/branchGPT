import { compare } from 'bcrypt-ts';
import NextAuth, { type User as NextAuthUser, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { generateId } from 'ai';

import { getUser, createUser, hasActiveSubscription, startFreeTrial, checkFreeTrialStatus } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface User extends NextAuthUser {
  isNewUser?: boolean;
}

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);
        if (users.length === 0) return null;
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, allow it
      if (url.startsWith('/')) return url;
      // If the url is from our domain, allow it
      if (url.startsWith(baseUrl)) return url;
      // If there's an error, redirect to pricing
      if (url.includes('error=')) return '/pricing';
      // Otherwise, redirect to the pricing page
      return '/pricing';
    },
    async signIn({ user, account }) {
      // For Google sign-in, create user if they don't exist
      if (account?.provider === 'google') {
        const users = await getUser(user.email!);
        if (users.length === 0) {
          const randomPassword = generateId(32);
          await createUser(user.email!, randomPassword);
          // Start free trial for new users
          const newUsers = await getUser(user.email!);
          if (newUsers.length > 0) {
            await startFreeTrial(newUsers[0].id);
          }
        }
        // Check subscription status for Google users
        try {
          const existingUser = await getUser(user.email!);
          if (existingUser.length > 0) {
            const hasSubscription = await hasActiveSubscription(existingUser[0].id);
            if (!hasSubscription) {
              const trialStatus = await checkFreeTrialStatus(existingUser[0].id);
              if (!trialStatus.isActive) {
                return '/pricing';
              }
            }
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
          return '/pricing';
        }
      }
      return true;
    },
  },
});
