import { auth } from "@/lib/auth";
import MerchantDashboard from "@/components/merchantDashboard";
import Redirect from "@/components/redirect";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        return <Redirect redirectTo="/auth" />
    }

    if (!session.user.shop) {
        return <Redirect redirectTo="/onboarding" />
    }

    return (
        <MerchantDashboard />
    )
}