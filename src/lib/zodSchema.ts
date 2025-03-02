import { z } from "zod";

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