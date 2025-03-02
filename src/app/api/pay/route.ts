import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getMint,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { z } from "zod";

import { connection, QUOTE_URI, SWAP_URI, USDC_MINT } from "@/lib/constants";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

const querySchema = z.object({
  customer: z
    .string()
    .refine(
      (val) => {
        try {
          new PublicKey(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid Solana public key" }
    )
    .transform((val) => new PublicKey(val)),
  inputTokenMint: z
    .string()
    .refine(
      (val) => {
        try {
          new PublicKey(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid token mint public key" }
    )
    .transform((val) => new PublicKey(val)),
  tokenAmount: z
    .string()
    .transform((val) => parseInt(val.replace(/"/g, ""), 10))
    .refine((val) => val > 0, {
      message: "tokenAmount must be greater than 0",
    }),

  shopId: z
    .string()
    .transform((val) => parseInt(val.replace(/"/g, ""), 10))
    .refine((value) => value > 0, {
      message: "shop id should not be in negative",
    }),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const result = querySchema.safeParse({
    customer: searchParams.get("customer"),
    inputTokenMint: searchParams.get("inputTokenMint"),
    tokenAmount: searchParams.get("tokenAmount"),
    shopId: searchParams.get("shopId"),
  });

  if (!result.success) {
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const shop = await db
      .select()
      .from(shops)
      .where(eq(shops.id, result.data.shopId))
      .then((res) => res[0]);

    if (!shop) {
      return Response.json({ error: "Shop not found" }, { status: 404 });
    }

    const inputMint = await getMint(
      connection,
      new PublicKey(result.data.inputTokenMint)
    );
    const tokenAmountToLamports = inputMint.decimals * result.data.tokenAmount;

    const quoteResponse = await fetch(
      `${QUOTE_URI}?inputMint=${inputMint.address.toBase58()}&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${tokenAmountToLamports}&slippageBps=50&restrictIntermediateTokens=true&swapMode=ExactOut`
    );

    if (!quoteResponse.ok) {
      throw new Error(
        `Quote request failed with status ${quoteResponse.status}`
      );
    }

    const quoteData = await quoteResponse.json();

    const destinationTokenAccount = await getAssociatedTokenAddress(
      new PublicKey(USDC_MINT),
      new PublicKey(shop.solanaPublicKey),
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const swapResponse = await fetch(SWAP_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse: quoteData,
        userPublicKey: result.data.customer.toBase58(),
        destinationTokenAccount: destinationTokenAccount.toBase58(),
      }),
    });

    let { swapTransaction } = await swapResponse.json();

    return Response.json({ swapTransaction });

    // const account = await connection.getAccountInfo(destinationTokenAccount, {
    //   commitment: "confirmed",
    // });

    // if (account) {
    //   return Response.json({ swapTransaction });
    // }

    // const transaction = VersionedTransaction.deserialize(
    //   Buffer.from(swapTransaction, "base64")
    // );

    // const createAccountIx = await createAssociatedTokenAccountInstruction(
    //   result.data.customer,
    //   destinationTokenAccount,
    //   result.data.customer,
    //   new PublicKey(USDC_MINT),
    //   TOKEN_PROGRAM_ID,
    //   ASSOCIATED_TOKEN_PROGRAM_ID
    // );

    // const addressLookupTableAccounts = await Promise.all(
    //   transaction.message.addressTableLookups.map(async (lookup) => {
    //     return new AddressLookupTableAccount({
    //       key: lookup.accountKey,
    //       state: AddressLookupTableAccount.deserialize(
    //         await connection
    //           .getAccountInfo(lookup.accountKey)
    //           .then((res) => res!.data)
    //       ),
    //     });
    //   })
    // );

    // let message = TransactionMessage.decompile(transaction.message, {
    //   addressLookupTableAccounts: addressLookupTableAccounts,
    // });
    // message.instructions = [createAccountIx, ...message.instructions];

    // transaction.message = message.compileToV0Message(
    //   addressLookupTableAccounts
    // );

    // swapTransaction = Buffer.from(transaction.serialize()).toString("base64");

    // return Response.json({ swapTransaction });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Transaction creation failed", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}
