import { z } from "zod";

export const businessInfoSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(300, { message: "Description must be less than 300 characters" }),
  logo: z.any().optional(),
});

export const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const paymentDetailsSchema = z.object({
  solanaPublicKey: z
    .string()
    .regex(solanaAddressRegex, { message: "Invalid Solana public key" }),
  webhookUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export const paymentFormSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be greater than 0" }
  ),
  token: z.string().min(1, { message: "Please select a token" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .optional(),
  reference: z.string().optional(),
});

export type BusinessInfoValues = z.infer<typeof businessInfoSchema>;
export type PaymentDetailsValues = z.infer<typeof paymentDetailsSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
