import { VersionedTransaction } from "@solana/web3.js";
import { NextRequest } from "next/server";
import { z } from "zod";

import { connection } from "@/lib/constants";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (_request: NextRequest) => {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const postRequestSchema = z.object({
  signedTransaction: z.string(),
  paymentDetails: z.object({
    amount: z
      .string()
      .refine((value) => parseInt(value))
      .transform((value) => parseInt(value)),
    token: z.string(),
    email: z.string().email(),
    name: z.string(),
    reference: z.string().nullable(),
  }),
  shopId: z.number().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedRequest = postRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      console.log(parsedRequest.error);
      return Response.json(
        {
          error: "Invalid request data",
          details: parsedRequest.error.format(),
        },
        { status: 400 }
      );
    }

    const { shopId, paymentDetails, signedTransaction } = parsedRequest.data;

    const shop = await db.query.shops.findFirst({
      where: eq(shops.id, shopId),
    });

    if (!shop) {
      return Response.json(
        {
          error: "Shop not found",
        },
        { status: 404 }
      );
    }

    const transaction = VersionedTransaction.deserialize(
      Buffer.from(signedTransaction, "base64")
    );

    // const entry = await db
    //   .insert(payments)
    //   .values({
    //     shopId: shopId,
    //     email: paymentDetails.email,
    //     name: paymentDetails.name,
    //     amount: paymentDetails.amount,
    //     status: "pending",
    //     createdAt: new Date().toISOString(),
    //   })
    //   .returning();

    const result = await connection.simulateTransaction(transaction);
    console.log(result);

    // if (!result || result.value.err) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Transaction simulation failed",
    //       error: result?.value.err || "Unknown error",
    //     },
    //     { status: 400 }
    //   );
    // }

    //   await db
    //     .update(payments)
    //     .set({
    //       status: "done",
    //     })
    //     .where(eq(payments.id, entry[0].id));

    return Response.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        reference: paymentDetails.reference,
        amount: paymentDetails.amount,
        email: paymentDetails.email,
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error });
  }
}
