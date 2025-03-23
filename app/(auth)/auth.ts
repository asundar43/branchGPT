import { compare } from 'bcrypt-ts';
import NextAuth, { type User as NextAuthUser, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
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
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        console.log('Credentials authorize:', { email });
        const users = await getUser(email);
        if (users.length === 0) {
          console.log('No user found for credentials');
          return null;
        }
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) {
          console.log('Password mismatch');
          return null;
        }
        console.log('Credentials auth successful, user ID:', users[0].id);
        return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { 
        tokenId: token.id, 
        userId: user?.id, 
        provider: account?.provider 
      });
      
      if (user?.id) {
        token.id = user.id;
        console.log('Setting token.id from user.id:', user.id);
      }
      
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: any }) {
      console.log('Session callback:', { 
        sessionUserId: session.user?.id, 
        tokenId: token.id 
      });
      
      if (session.user && token.id) {
        session.user.id = token.id as string;
        console.log('Setting session.user.id from token.id:', token.id);
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });
      
      // If the url is relative, preserve it
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // If the url is from our domain, allow it
      if (url.startsWith(baseUrl)) return url;
      
      // If there's an error, redirect to pricing
      if (url.includes('error=')) return `${baseUrl}/pricing`;
      
      // For all other cases, go to /chat
      return `${baseUrl}/chat`;
    },
    async signIn({ user }) {
      console.log('SignIn callback:', { 
        email: user.email, 
        userId: user.id 
      });
      
      return true;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/pricing',
  },
});
