import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import type { User } from "./_lib/definition";
import bcrypt from "bcryptjs-react";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log({ req });
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // const user = await getUser(email);
          // if (!user) return null;
          // const passwordsMatch = await bcrypt.compare(password, user.password);

          // if (passwordsMatch) return user;
          // console.log({ email, password });
          const userMock = {
            id: "1",
            name: "Paola Guzmán",
            email: "admin@lactaconsejos.com",
            password: "123456",
            username: "paolaguzman",
          };
          if (email === userMock.email && password === userMock.password) {
            // console.log("going to be");
            // // return true;
            return userMock;
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
