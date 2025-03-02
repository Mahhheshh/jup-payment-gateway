"use client";

import { useMerchant } from "@/hooks/use-merchant";
import { useState, useEffect } from "react";
import {
  BadgeCheck,
  ArrowLeft,
  CheckCircle,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getTokenById } from "@/lib/tokens";
import { PaymentModal } from "@/components/PaymentModel";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MerchantProfile() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentParams, setPaymentParams] = useState<{
    amount?: string;
    token?: string;
    description?: string;
    customerId?: string;
  } | null>(null);


  const params = useParams();
  const { id } = params;
  const { merchant, loading, error } = useMerchant(id[0] || "");

  const wallet = useWallet();

  useEffect(() => {
    if (merchant?.theme) {
      document.body.style.background = merchant.theme.backgroundColor;

      return () => {
        document.body.style.background = "";
      };
    }
  }, [merchant]);

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Merchant Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the merchant you're looking for.
          </p>
          <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center" style={{ color: merchant?.theme?.textColor }}>
      <div className="container max-w-4xl py-8 px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: merchant?.theme?.textColor }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="w-full mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            {loading ? (
              <Skeleton className="w-28 h-28 rounded-2xl" />
            ) : (
              <div
                className="w-28 h-28 rounded-2xl overflow-hidden border shadow-md flex items-center justify-center"
                style={{
                  borderColor: merchant.theme?.accentColor || 'border-border',
                  backgroundColor: merchant.theme?.cardBackground || 'white'
                }}
              >
                <img
                  src={merchant.logoUrl}
                  alt={merchant.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 space-y-4 text-center md:text-left">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-10 w-40 mx-auto md:mx-0" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold font-display">{merchant.businessName}</h1>
                    {merchant.verified && (
                      <Badge
                        variant="outline"
                        className="h-7 px-3 gap-1 ml-0 md:ml-2 mx-auto md:mx-0 w-fit"
                        style={{
                          backgroundColor: `${merchant.theme?.accentColor}20`,
                          borderColor: `${merchant.theme?.accentColor}40`,
                          color: merchant.theme?.accentColor
                        }}
                      >
                        <BadgeCheck className="h-4 w-4" />
                        <span className="text-xs font-medium">Verified Merchant</span>
                      </Badge>
                    )}
                  </div>

                  <p className="text-md opacity-80">{merchant.description}</p>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Badge
                      variant="secondary"
                      className="gap-1.5 px-3 py-1 text-sm"
                      style={{
                        backgroundColor: `${merchant.theme?.accentColor}15`,
                        color: merchant.theme?.textColor
                      }}
                    >
                      <Tag className="h-4 w-4" />
                      <span>{merchant.industry}</span>
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Button
                      className="md:w-auto px-8 h-11 text-base font-medium hover:opacity-90 transition-all"
                      style={{
                        backgroundColor: merchant.theme?.accentColor || 'primary',
                        color: merchant.theme?.buttonTextColor || 'white'
                      }}
                      onClick={handleOpenPaymentModal}
                      disabled={!wallet.connected}
                    >
                      Pay with Crypto
                    </Button>

                    <WalletMultiButton
                      className="md:w-auto px-8! h-11! text-base font-medium hover:opacity-90 transition-all"
                      style={{
                        backgroundColor: merchant.theme?.accentColor || 'primary',
                        color: merchant.theme?.buttonTextColor || 'white'
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator className="my-8 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="shadow-sm"
              style={{
                backgroundColor: loading ? undefined : merchant.theme?.cardBackground,
                borderColor: loading ? undefined : `${merchant.theme?.accentColor}30`,
                color: loading ? undefined : merchant.theme?.textColor
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-display">
                  {loading ? <Skeleton className="h-7 w-40" /> : "Accepting Tokens"}
                </CardTitle>
                <CardDescription style={{ color: loading ? undefined : `${merchant.theme?.textColor}80` }}>
                  {loading ? <Skeleton className="h-4 w-full" /> : "This merchant accepts the following cryptocurrencies."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {merchant.supportedTokens.map((tokenId: string) => {
                      const token = getTokenById(tokenId);
                      if (!token) return null;

                      return (
                        <div key={tokenId} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: `${merchant.theme?.accentColor}20` }}
                          >
                            <img
                              src={token.iconUrl}
                              alt={token.name}
                              className="w-7 h-7 object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-xs opacity-70">{token.symbol}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card
              className="shadow-sm"
              style={{
                backgroundColor: loading ? undefined : merchant.theme?.cardBackground,
                borderColor: loading ? undefined : `${merchant.theme?.accentColor}30`,
                color: loading ? undefined : merchant.theme?.textColor
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-display">
                  {loading ? <Skeleton className="h-7 w-48" /> : "Trust & Security"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Skeleton className="h-5 w-5 mt-0.5 rounded-full" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: merchant.theme?.accentColor }}
                      />
                      <div>
                        <div className="font-medium">Verified Merchant</div>
                        <p className="text-sm opacity-70">
                          This merchant has been verified by our team.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                        style={{ color: merchant.theme?.accentColor }}
                      />
                      <div>
                        <div className="font-medium">Secure Transactions</div>
                        <p className="text-sm opacity-70">
                          All payments are processed securely on the blockchain.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {!loading && merchant && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          merchant={merchant}
          initialValues={paymentParams}
        />
      )}
    </div>
  );
}