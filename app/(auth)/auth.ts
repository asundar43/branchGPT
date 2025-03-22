import { compare } from 'bcrypt-ts';
import NextAuth, { type User as NextAuthUser, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { generateId } from 'ai';

import { getUser, createUser } from '@/lib/db/queries';

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
      // Handle successful Stripe subscription
      if (url.includes('success=true')) {
        return `${baseUrl}/chat?success=true`;
      }
      
      // Handle pricing page redirects
      if (url.includes('/pricing')) {
        return `${baseUrl}/pricing`;
      }

      // Handle chat redirects
      if (url.includes('/chat')) {
        return `${baseUrl}/chat`;
      }

      // Default to the original URL with baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      return url;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const users = await getUser(user.email!);
        if (users.length === 0) {
          const randomPassword = generateId(32);
          await createUser(user.email!, randomPassword);
          return '/pricing';
        }
      }
      return true;
    },
  },
});
