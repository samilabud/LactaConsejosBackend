import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const user = {
  id: "1",
  name: "Paola Guzmán",
  email: "admin@lactaconsejos.com",
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const mockUser = {
          id: 1,
          email: "admin@lactaconsejos.com",
          name: "Paola Guzman",
        };
        if (
          credentials.email === mockUser.email &&
          credentials.password === "123456"
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
  },
};
