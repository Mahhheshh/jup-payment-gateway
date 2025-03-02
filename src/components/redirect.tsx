"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

type RedirectProps = {
    redirectTo: string
}

export default function Redirect({ redirectTo }: RedirectProps) {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push(redirectTo);
        }, 5000);
    }, [router, redirectTo])

    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-6">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl font-display font-semibold mb-6 tracking-tight">
                    Authentication Required
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    You're being redirected to the login page. Please authenticate to continue with onboarding.
                </p>

                <div className="flex justify-center">
                    <Link href={redirectTo}>
                        <Button
                            className="h-12 px-8 text-base"
                            size="lg"
                        >
                            Sign In Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}