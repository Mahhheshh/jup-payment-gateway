import { OnboardingProvider } from "@/context/OnboardingContext";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { auth } from "@/lib/auth";
import Redirect from "@/components/redirect";

export default async function Onboarding() {
    const session = await auth();

    if (!session) {
        return <Redirect redirectTo="/auth" />
    }

    return (
        <OnboardingProvider>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-xl animate-fade-in">
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Home</span>
                    </Link>

                    <OnboardingForm />
                </div>
            </div>
        </OnboardingProvider>
    );
}