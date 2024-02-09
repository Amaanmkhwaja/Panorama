import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/agency/auth/login",
    error: "/agency/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      // console.log("async jwt callback - received");
      // if no token, then we are logged out
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      // this is also impt when updating a user's settings in the settings page
      // without this, old settings will still be displaying and not the new changes
      // this is also impt for adding anything u want in a user's session such as the "role"
      token.isOAth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
    async session({ token, session }) {
      // console.log("async session callback - received");
      // console.log({ sessionToken: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      // same explanation as the comment in the jwt callback function
      // important for updating a user's settings whenever they change
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email || "";
        session.user.isOAuth = token.isOAth as boolean;
      }

      return session;
    },
    async signIn({ user, account }) {
      // console.log({
      //   user,
      //   account,
      // });
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id) {
        console.log("async signIn callback error - missing user.id");
        return false;
      }

      const existingUser = await getUserById(user.id);

      if (!existingUser) return false;

      // TODO:
      // Prevent sign in without email verification
      // if (!existingUser || !existingUser.emailVerified) return false;

      // TODO: Add 2FA check

      return true;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
