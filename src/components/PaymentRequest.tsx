
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getTokenById } from "@/lib/tokens";
// import { toast } from "sonner";
import { CreditCard, Copy, CheckCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const paymentRequestSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be greater than 0" }
  ),
  token: z.string().min(1, { message: "Please select a token" }),
  description: z.string().optional(),
  customerId: z.string().optional(),
});

interface PaymentRequestFormProps {
  merchantId: string;
  supportedTokens: string[];
}

export function PaymentRequestForm({ merchantId, supportedTokens }: PaymentRequestFormProps) {
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const form = useForm<z.infer<typeof paymentRequestSchema>>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      amount: "",
      token: supportedTokens[0] || "",
      description: "",
      customerId: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof paymentRequestSchema>) => {
    // In a real app, this would create a payment request in the database
    console.log("Creating payment request:", values);
    
    // Generate a payment link
    const params = new URLSearchParams();
    params.append("amount", values.amount);
    params.append("token", values.token);
    
    if (values.description) {
      params.append("description", values.description);
    }
    
    if (values.customerId) {
      params.append("customerId", values.customerId);
    }
    
    const url = `${window.location.origin}/merchant/${merchantId}?${params.toString()}`;
    setPaymentLink(url);
    // toast.success("Payment request created successfully");
  };
  
  const copyPaymentLink = () => {
    if (!paymentLink) return;
    
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // toast.success("Payment link copied to clipboard");
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input 
                        {...field} 
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="pl-8" 
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
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedTokens.map((tokenId) => {
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What is this payment for?"
                    rows={3}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer ID (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="For your reference" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Generate Payment Link
          </Button>
        </form>
      </Form>
      
      {paymentLink && (
        <Card className="p-4 mt-6 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <h3 className="font-medium mb-1">Payment Link</h3>
              <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap bg-background p-2 rounded border">
                {paymentLink}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyPaymentLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this link with your customer to receive a payment with the specified details.
          </p>
        </Card>
      )}
    </div>
  );
}