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

export const profileFormSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(300, { message: "Description must be less than 300 characters" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  solanaPublicKey: z
    .string()
    .min(1, { message: "Solana public key is required" }),
  webhookUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export const themeFormSchema = z.object({
  primaryColor: z.string().min(1, { message: "Primary color is required" }),
  backgroundColor: z
    .string()
    .min(1, { message: "Background color is required" }),
  fontColor: z.string().min(1, { message: "Font color is required" }),
});

export type NewMerchantRequest = z.infer<typeof NewMerchantSchema>;
export type ProfileFormRequest = z.infer<typeof profileFormSchema>;
export type ThemeFormRequest = z.infer<typeof themeFormSchema>;
