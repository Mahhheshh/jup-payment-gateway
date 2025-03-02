import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from 'next/link'

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 tracking-tight">
            Accept crypto payments with ease
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A simple, secure way to accept cryptocurrency payments for your business.
            Start receiving payments in minutes, not days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button
                className="h-12 px-8 text-base"
                size="lg"
              >
                Start Accepting Payments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/merchant/1">
              <Button
                variant="outline"
                className="h-12 px-8 text-base"
                size="lg"
              >
                View Demo Store
              </Button>
            </Link>

            <Link href="/merchant/dashboard/">
              <Button
                variant="secondary"
                className="h-12 px-8 text-base"
                size="lg"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Merchant Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TokenExpressway. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
