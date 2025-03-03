"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessInfoSchema, paymentDetailsSchema, BusinessInfoValues, PaymentDetailsValues, solanaAddressRegex } from "@/lib/validations";
import { useOnboarding } from "@/context/OnboardingContext";
import { CheckCircle, Upload, ChevronRight, ChevronLeft } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Redirect from "../redirect";
import { useRouter } from "next/navigation";

const BusinessInfoForm = () => {
    const { data, updateBusinessInfo } = useOnboarding();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<BusinessInfoValues>({
        resolver: zodResolver(businessInfoSchema),
        defaultValues: {
            name: data.businessInfo.name,
            description: data.businessInfo.description,
        },
    });

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setLogoPreview(dataUrl);
            updateBusinessInfo({ logo: dataUrl });
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = (values: BusinessInfoValues) => {
        updateBusinessInfo(values);
    };

    return (
        <div className="animate-fade-in">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Business Name" {...field} className="h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your business in a few sentences"
                                            {...field}
                                            className="resize-none min-h-[120px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Business Logo</FormLabel>
                            <div className="flex items-start gap-4">
                                <div className="w-28 h-28 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden relative">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-2">
                                            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground mt-1">Upload logo</p>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p>Upload a square logo image</p>
                                    <p>Max size: 5MB</p>
                                    <p>Recommended: 512x512 pixels</p>
                                </div>
                            </div>
                        </FormItem>
                    </div>

                    <Button type="submit"
                        className="w-full h-12 mt-8 group">
                        <span>Continue</span>
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </form>
            </Form>
        </div>
    );
};

const PaymentDetailsForm = () => {
    const { data, updatePaymentDetails, prevStep, submitOnboarding } = useOnboarding();

    const form = useForm<PaymentDetailsValues>({
        resolver: zodResolver(paymentDetailsSchema),
        defaultValues: {
            solanaPublicKey: data.paymentDetails.solanaPublicKey,
            webhookUrl: data.paymentDetails.webhookUrl,
        },
    });

    const onSubmit = (values: PaymentDetailsValues) => {
        updatePaymentDetails(values);
        submitOnboarding();
    };

    return (
        <div className="animate-fade-in">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="solanaPublicKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Solana Public Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your Solana wallet address"
                                            {...field}
                                            className="h-12 font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Webhook URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://your-website.com/webhooks/payments"
                                            {...field}
                                            className="h-12"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-4 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-1/2 h-12 group"
                            onClick={prevStep}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </Button>
                        <Button type="submit" className="w-1/2 h-12">
                            <span>Submit</span>
                            <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ["Business Information", "Payment Details"];

    const getStepStyles = (index: number) => {
        const isCurrentStep = index + 1 === currentStep;
        const isPreviousStep = index + 1 < currentStep;

        return {
            step: `rounded-full flex items-center justify-center w-10 h-10 ${isCurrentStep
                ? "bg-primary text-primary-foreground"
                : isPreviousStep
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-secondary-foreground"
                }`,
            connector: `w-20 h-0.5 mx-2 ${isPreviousStep ? "bg-primary" : "bg-secondary"
                }`
        };
    };

    return (
        <div className="flex justify-center mb-8">
            {steps.map((step, index) => {
                const styles = getStepStyles(index);
                return (
                    <div key={step} className="flex items-center">
                        <div className={styles.step}>
                            {index + 1 < currentStep ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>

                        {index < steps.length - 1 && (
                            <div className={styles.connector} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const OnboardingForm = ({ userId }: { userId: string }) => {
    const { setUserId, data } = useOnboarding();
    const router = useRouter();

    useEffect(() => {
        if (!userId) return;
        setUserId(userId);
    }, [userId]);

    useEffect(() => {
        if (data.isSubmitted) {
            router.push("/merchant/dashboard");
        }
    }, [data.isSubmitted]);

    return (
        <Card className="w-full max-w-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-white/20 dark:border-white/10 rounded-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-display text-center">
                    Merchant Onboarding
                </CardTitle>
                <CardDescription className="text-center max-w-sm mx-auto">
                    Set up your merchant profile to start accepting crypto payments on your website or app.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ProgressIndicator currentStep={data.step} />
                {data.step === 1 && <BusinessInfoForm />}
                {data.step === 2 && <PaymentDetailsForm />}
            </CardContent>
        </Card>
    );
};

export default OnboardingForm;