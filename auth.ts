import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@vercel/postgres";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
    const client = await db.connect();
  try {
    const user =
      await client.sql<User>`SELECT * FROM users WHERE email=${email}`;
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
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);
                    if (parsedCredentials.success) {
                      const { email, password } = parsedCredentials.data;
                      const user = await getUser(email);
                        if (!user) return null;
                                  const passwordsMatch = await bcrypt.compare(
                                    password,
                                    user.password
                                  );

                                  if (passwordsMatch) return user;
            }
            console.log("Invalid credentials");
            return null;

        // Here you would typically:
        // 1. Validate the credentials against your database
        // 2. Return a user object if valid
        // 3. Return null if invalid

      },
    }),
  ],
});
