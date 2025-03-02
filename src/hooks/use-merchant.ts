import { useState, useEffect } from "react";
import { z } from "zod";

export const MerchantSchema = z.object({
  id: z.number(),
  businessName: z.string(),
  description: z.string(),
  logoUrl: z.string(),
  industry: z.string(),
  solanaPublicKey: z.string(),
  webhookUrl: z.string().optional(),
  verified: z.boolean(),
  supportedTokens: z.array(z.string()),
  theme: z.object({
    textColor: z.string(),
    accentColor: z.string(),
    cardBackground: z.string(),
    buttonTextColor: z.string(),
  }),
  publicProfileUrl: z.string(),
});

export type Merchant = z.infer<typeof MerchantSchema>;

export async function getMerchantById(
  id: string
): Promise<Merchant | undefined> {
  try {
    const response = await fetch(`/api/merchant?shopId=${id}`);

    if (!response.ok) {
      console.log(`API error: ${response.status} ${response.statusText}`);
      throw new Error("Failed to fetch merchant data");
    }

    const data = await response.json();

    const validatedMerchant = MerchantSchema.parse(data.shop);
    return validatedMerchant;
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return undefined;
  }
}

export function useMerchant(merchantId: string) {
  const [merchant, setMerchant] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const merchantData = await getMerchantById(merchantId);
        if (!merchantData) {
          throw new Error("Merchant not found");
        }

        const sampleTransactions = Array(8)
          .fill(null)
          .map((_, index) => ({
            id: `tx-${index}`,
            amount: Math.floor(Math.random() * 100) + 5,
            tokenId:
              merchantData.supportedTokens[
                Math.floor(Math.random() * merchantData.supportedTokens.length)
              ],
            tokenAmount: Math.random() * 10,
            timestamp: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ),
            status:
              Math.random() > 0.1
                ? "completed"
                : Math.random() > 0.5
                ? "pending"
                : "failed",
            customerEmail: `customer${Math.floor(
              Math.random() * 1000
            )}@example.com`,
          }));

        setMerchant(merchantData);
        setTransactions(sampleTransactions);
      } catch (err) {
        console.error("Error fetching merchant data:", err);
        setError("Failed to load merchant data");
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  return { merchant, transactions, loading, error };
}
