import { useMerchant } from "@/hooks/use-merchant";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const formatTransactionDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const anonymizeEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const firstChar = username.charAt(0);
    const lastChar = username.charAt(username.length - 1);
    const middlePart = '*'.repeat(Math.min(5, username.length - 2));
    return `${firstChar}${middlePart}${lastChar}@${domain}`;
};

export const RecentTransactionTable = () => {
    const loading = false;
    const transactions = [
        {
            id: "tx_1",
            amount: 125.50,
            status: "completed",
            customerEmail: "john.doe@example.com",
            tokenAmount: 0.003654,
            tokenId: "USDC",
            timestamp: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
            id: "tx_2",
            amount: 75.20,
            status: "pending",
            customerEmail: "alice.smith@example.com",
            tokenAmount: 0.002187,
            tokenId: "USDC",
            timestamp: new Date(Date.now() - 1000 * 60 * 45)
        },
        {
            id: "tx_3",
            amount: 250.00,
            status: "failed",
            customerEmail: "robert.johnson@example.com",
            tokenAmount: 0.007235,
            tokenId: "USDC",
            timestamp: new Date(Date.now() - 1000 * 60 * 120)
        },
        {
            id: "tx_4",
            amount: 50.75,
            status: "completed",
            customerEmail: "emma.williams@example.com",
            tokenAmount: 0.001478,
            tokenId: "USDC",
            timestamp: new Date(Date.now() - 1000 * 60 * 240)
        }];

    return (
        <div className="lg:col-span-2">
            <Card className="border border-border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="flex justify-between p-3 border-b border-border last:border-0">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex justify-between items-start px-4 py-3">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-sm text-foreground">
                                                ${transaction.amount.toFixed(2)}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    transaction.status === "completed"
                                                        ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                                                        : transaction.status === "pending"
                                                            ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                                            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                                                }
                                            >
                                                <span>{transaction.status}</span>
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {anonymizeEmail(transaction.customerEmail)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-0.5">
                                        <div className="text-sm font-medium">
                                            {transaction.tokenAmount.toFixed(6)} {transaction.tokenId.toUpperCase()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatTransactionDate(transaction.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}