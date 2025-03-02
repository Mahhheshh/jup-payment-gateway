import { NextRequest } from "next/server";

import { users } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";
export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shopId = searchParams.get("shopId");

    if (!shopId) {
      return Response.json({ error: "Shop ID is required" }, { status: 400 });
    }

    const parsedShopId = z.coerce.number().safeParse(shopId);

    if (!parsedShopId.success) {
      return Response.json(
        { error: "Invalid shop ID format" },
        { status: 400 }
      );
    }

    const shop = await db.query.shops.findFirst({
      where: (shops, { eq }) => eq(shops.id, parsedShopId.data),
    });
    if (!shop) {
      return Response.json({ error: "Shop not found" }, { status: 404 });
    }
    // Format the response data with specific fields
    const responseData = {
      id: shop.id,
      businessName: shop.name,
      description: shop.description,
      logoUrl:
        "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=100&h=100&auto=format&fit=crop",
      industry: "Food & Beverage",
      solanaPublicKey: shop.solanaPublicKey,
      verified: true,
      supportedTokens: ["solana", "usdc"],
      theme: {
        textColor: "#2d2d2d",
        accentColor: "#6a4831",
        cardBackground: "#f5f0ea",
        buttonTextColor: "#ffffff",
      },
      publicProfileUrl: `http://localhost:3000/merchant/${shop.id}`,
    };

    return Response.json({ shop: responseData });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async () => {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
};
