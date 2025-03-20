import { compare } from 'bcrypt-ts';
import NextAuth, { type User as NextAuthUser, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

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
        const users = await getUser(email);
        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Add a flag to indicate if this is a new user
        if (!token.isNewUser) {
          token.isNewUser = true;
        }
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Add the isNewUser flag to the session
        session.user.isNewUser = token.isNewUser;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, prefix it with the base URL
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // If the url is external, redirect to the dashboard
      if (url.startsWith('http')) return `${baseUrl}/chat`;
      // Default to the dashboard
      return `${baseUrl}/chat`;
    },
  },
});
