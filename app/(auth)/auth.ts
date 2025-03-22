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
        try {
          const users = await getUser(user.email!);
          
          // Create new user if they don't exist
          if (users.length === 0) {
            const randomPassword = generateId(32);
            await createUser(user.email!, randomPassword);
            
            // Get the newly created user
            const newUsers = await getUser(user.email!);
            if (newUsers.length > 0) {
              // Start free trial for new users
              await startFreeTrial(newUsers[0].id);
              return true; // Allow sign in and redirect to chat
            }
          }
          
          // For existing users, check subscription status
          const existingUser = users[0];
          const hasSubscription = await hasActiveSubscription(existingUser.id);
          
          if (!hasSubscription) {
            const trialStatus = await checkFreeTrialStatus(existingUser.id);
            if (!trialStatus.isActive) {
              // If no active subscription or trial, allow sign in but redirect to pricing
              return '/pricing';
            }
          }
          
          return true; // Allow sign in and use default redirect
        } catch (error) {
          console.error('Error in Google sign-in:', error);
          return '/pricing'; // On error, redirect to pricing
        }
      }
      
      return true; // Allow sign in for other providers
    },
  },
});
