"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTokenById, formatCurrency, convertUsdToToken } from "@/lib/tokens";
import { paymentFormSchema, PaymentFormValues } from "@/lib/validations";
import { Loader2, CheckCircle, X, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
// import { getTokenAccounts } from "@/lib/getTokenAccounts";
import { clusterApiUrl, Connection, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Merchant } from "@/hooks/use-merchant";
import { USDC_MINT } from "@/lib/constants";

type PaymentStatus = "idle" | "processing" | "success" | "failed";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant;
  initialValues?: {
    amount?: string;
    token?: string;
    description?: string;
    customerId?: string;
  } | null;
}

export function PaymentModal({ isOpen, onClose, merchant, initialValues = null }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [selectedToken, setSelectedToken] = useState(initialValues?.token || merchant?.supportedTokens?.[0] || "solana");
  const [amount, setAmount] = useState<string>(initialValues?.amount || "10.00");

  const wallet = useWallet();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: initialValues?.amount || "10.00",
      token: initialValues?.token || merchant?.supportedTokens?.[0] || "usdc",
      email: "",
      name: "",
      reference: initialValues?.description || "",
    },
  });

  const token = getTokenById(form.watch("token"));

  // useEffect(() => {
  //   if (!wallet.connected) return;

  //   // Get available tokens for the connected wallet
  //   const fetchWalletTokens = async () => {
  //     try {
  //       if (!wallet.publicKey) return;

  //       // await getTokenAccounts(wallet.publicKey.toBase58()); // TODO: simulate

  //     } catch (error) {
  //       console.error("Error fetching wallet tokens:", error);
  //     }
  //   };

  //   fetchWalletTokens();

  // }, [wallet.connected])

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus("idle");
      form.reset({
        amount: initialValues?.amount || "10.00",
        token: initialValues?.token || merchant?.supportedTokens?.[0] || "solana",
        email: "",
        name: "",
        reference: initialValues?.description || "",
      });
    }
  }, [isOpen, form, merchant?.supportedTokens, initialValues]);

  const onSubmit = async (values: PaymentFormValues) => {
    setPaymentStatus("processing");

    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        toast("Please connect your wallet");
        setPaymentStatus("failed");
        return;
      }

      // TODO: change later; make it dynamic
      const token = "So11111111111111111111111111111111111111112";
      const response = await fetch(`/api/pay?customer=${wallet.publicKey.toString()}&inputTokenMint=${token}&tokenAmount=${values.amount}&shopId=${merchant.id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get payment transaction");
      }

      const { swapTransaction } = await response.json();

      if (!swapTransaction) {
        throw new Error("Failed to create swap transaction");
      }

      const transaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));

      console.log(JSON.stringify(transaction));

      try {
        const signedTransaction = await wallet.signTransaction(transaction);

        const serilized = signedTransaction.serialize()

        const verifyResponse = await fetch('/api/pay/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signedTransaction: Buffer.from(serilized).toString('base64'),
            paymentDetails: {
              amount: values.amount,
              token: values.token,
              email: values.email,
              name: values.name,
              reference: values.reference,
            },
            shopId: merchant.id
          }),
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          console.error("Verification failed:", errorData);
          throw new Error(errorData.message || "Transaction verification failed");
        }

        const verificationResult = await verifyResponse.json();
        console.log("Transaction verified:", verificationResult);

        setPaymentStatus("success");
        toast.success("Payment completed successfully!");
      } catch (error) {
        console.error("Transaction signing failed:", error);
        throw error;
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      toast("Payment failed. Please try again.");
    }
  };

  const handleClose = () => {
    if (paymentStatus === "processing") return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px] p-0 overflow-hidden"
        style={{
          background: merchant?.theme?.cardBackground || "white",
          color: merchant?.theme?.textColor || "inherit",
        }}
      >
        <div className="relative p-6">
          <DialogHeader className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden">
              <img
                src={merchant?.logoUrl}
                alt={merchant?.businessName}
                className="w-full h-full object-cover"
              />
            </div>
            <DialogTitle className="text-xl font-display">
              Pay {merchant?.businessName}
            </DialogTitle>
            <DialogDescription>
              Complete your payment securely with cryptocurrency
            </DialogDescription>
          </DialogHeader>

          {paymentStatus === "idle" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0.01"
                              className="pl-8"
                              onChange={(e) => {
                                field.onChange(e);
                                setAmount(e.target.value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Token</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedToken(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {merchant?.supportedTokens?.map((tokenId: string) => {
                              const token = getTokenById(tokenId);
                              if (!token) return null;

                              return (
                                <SelectItem key={tokenId} value={tokenId} className="flex items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden">
                                      <img src={token.iconUrl} alt={token.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span>{token.name} ({token.symbol})</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="your@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Order #123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card className="p-4 bg-primary/5 border-0 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Amount in {token?.symbol || "tokens"}:</span>
                    <span className="font-mono font-bold">{form.watch("amount")} {"USD"}</span>
                  </div>

                  <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <span>Current rate:</span>
                    <span>1 {token?.symbol} = ${token?.price}</span>
                  </div>
                </Card>

                <Button
                  type="submit"
                  className="w-full h-12 mt-4"
                  style={{
                    backgroundColor: merchant?.theme?.accentColor,
                    color: "#fff",
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay {formatCurrency(parseFloat(amount) || 0)}
                </Button>
              </form>
            </Form>
          )}

          {paymentStatus === "processing" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                <Loader2 className="w-20 h-20 animate-spin text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">Processing Payment</h3>
              <p className="text-muted-foreground text-center max-w-xs">
                Your payment is being processed. Please do not close this window.
              </p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground text-center max-w-xs mb-6">
                Thank you for your payment. A receipt has been sent to your email.
              </p>
              <Button onClick={handleClose} className="w-full">Close</Button>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <X className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">Payment Failed</h3>
              <p className="text-muted-foreground text-center max-w-xs mb-6">
                There was an error processing your payment. Please try again.
              </p>
              <div className="flex gap-4 w-full">
                <Button variant="outline" onClick={handleClose} className="w-1/2">Cancel</Button>
                <Button onClick={() => setPaymentStatus("idle")} className="w-1/2">Try Again</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}