import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      shop: {
        id: string;
        name: string;
        solanaPublicKey: string;
        webhookUrl: string;
      };
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db),
  providers: [Google],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;

      const shop = await db.query.shops.findFirst({
        where: (shops, { eq }) => eq(shops.userId, user.id),
      });

      if (!shop) {
        return session;
      }

      session.user.shop = {
        id: shop.id.toString(),
        name: shop.name,
        solanaPublicKey: shop.solanaPublicKey,
        webhookUrl: shop.webhookUrl,
      };
      return session;
    },
  },
});
