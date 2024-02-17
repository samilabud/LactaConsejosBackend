import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log({ auth, cb: "authorized" });
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log({ isLoggedIn, cb: "authorized" });
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log({ user, account, profile, email, credentials, cb: "signIn" });
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
