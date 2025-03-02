import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { shops } from "@/db/schema";

export const GET = async (_request: NextRequest) => {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const NewMerchantSchema = z.object({
  userId: z.string().uuid(),
  businessName: z.string().min(3, "Business name is required"),
  businessDescription: z
    .string()
    .min(10, "Business must have more than 10 character in description"),
  solanaPubKey: z.string().refine(
    (val) => {
      try {
        return val.length === 44 || val.length === 43;
      } catch {
        return false;
      }
    },
    { message: "Invalid Solana public key" }
  ),
  webhookUrl: z.string().url("Must be a valid URL"),
});

export type NewMerchantRequest = z.infer<typeof NewMerchantSchema>;

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  try {
    const result = NewMerchantSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Invalid request body", details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      userId,
      businessName,
      businessDescription,
      solanaPubKey,
      webhookUrl,
    } = result.data;

    const existingShop = await db.query.shops.findFirst({
      where: (shops, { eq }) => eq(shops.userId, userId),
    });

    if (existingShop) {
      return Response.json(
        { error: "User already has a shop" },
        { status: 409 }
      );
    }

    const [newShop] = await db
      .insert(shops)
      .values({
        userId,
        name: businessName,
        description: businessDescription || null,
        solanaPublicKey: solanaPubKey,
        webhookUrl,
      })
      .returning();

    return Response.json({ success: true, shop: newShop }, { status: 201 });
  } catch (error) {
    console.error("Error creating merchant shop:", error);
    return Response.json({ error: "Failed to create shop" }, { status: 500 });
  }
};
