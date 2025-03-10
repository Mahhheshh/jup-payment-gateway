"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export function SignInScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await signIn("google", { callbackUrl: "/onboarding" });
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-display font-semibold mb-2 tracking-tight">TokenExpressway</h1>
                <p className="text-muted-foreground">Accept crypto payments with ease</p>
            </div>

            <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-white/20 dark:border-white/10 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-display text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Access your merchant dashboard and payment tools
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="p-3 mb-6 bg-destructive/15 border border-destructive/30 rounded-md text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full h-12 flex items-center justify-center gap-2"
                        variant="outline"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Sign in with Google</span>
                            </>
                        )}
                    </Button>

                    <div className="mt-6 text-sm text-center text-muted-foreground">
                        <p>Start accepting crypto payments in minutes</p>
                        <p className="mt-1">Secure transactions, fast settlement, no chargebacks</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignInScreen;
