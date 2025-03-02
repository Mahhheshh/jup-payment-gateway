"use client";

import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useMerchant, getMerchantById, Merchant } from "@/hooks/use-merchant";
import { toast } from "sonner";
import { z } from "zod";
import {
    Check,
    Palette,
    ArrowLeft,
    Share2,
    Eye,
    Edit2,
    X,
    Save,
    BadgeCheck,
    Tag,
    DollarSign,
    BarChart2,
    Clock,
    Activity,
    Coins,
} from "lucide-react";

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// import { useParams } from "next/navigation";
// import { useRouter } from "next/navigation";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Separator } from "@radix-ui/react-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
    businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(300, { message: "Description must be less than 300 characters" }),
    industry: z.string().min(1, { message: "Please select an industry" }),
    solanaPublicKey: z.string().min(1, { message: "Solana public key is required" }),
    webhookUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

const themeFormSchema = z.object({
    primaryColor: z.string().min(1, { message: "Primary color is required" }),
    backgroundColor: z.string().min(1, { message: "Background color is required" }),
    fontColor: z.string().min(1, { message: "Font color is required" }),
});


interface TokenType {
    id: string;
    name: string;
    symbol: string;
    iconUrl: string;
}

interface TransactionType {
    id: string;
    date: Date;
    amount: number;
    token: string;
    customer: string;
    status: string;
}


export default function MerchantDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [editing, setEditing] = useState(false);
    const [editedMerchant, setEditedMerchant] = useState<Merchant | null>(null);
    const [tokens, setTokens] = useState<TokenType[]>([]);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [salesMetrics, setSalesMetrics] = useState({
        totalSales: 0,
        thisMonth: 0,
        lastMonth: 0,
        percentChange: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real application, these would be API calls
                setTimeout(() => {
                    const mockMerchant = {
                        id: 'merchant-1',
                        solanaPublicKey: "",
                        businessName: 'Crypto Coffee Shop',
                        description: 'We serve the best coffee in town, now accepting crypto payments!',
                        logoUrl: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=100&h=100&auto=format&fit=crop',
                        industry: 'Food & Beverage',
                        verified: true,
                        supportedTokens: ['token-1', 'token-2', 'token-3'],
                        theme: {
                            textColor: '#333333',
                            accentColor: '#6366F1',
                            cardBackground: '#FFFFFF',
                            buttonTextColor: '#FFFFFF'
                        },
                        publicProfileUrl: '/merchant/crypto-coffee-shop'
                    };

                    const mockTokens = [
                        { id: 'token-4', name: 'Solana', symbol: 'SOL', iconUrl: '/tokens/sol.png' },
                        { id: 'token-2', name: 'USD Coin', symbol: 'USDC', iconUrl: '/tokens/usdc.png' },
                    ];

                    const mockTransactions = [
                        { id: 'tx-1', date: new Date(2025, 1, 25), amount: 45.99, token: 'ETH', customer: 'john.eth', status: 'completed' },
                        { id: 'tx-2', date: new Date(2025, 1, 24), amount: 18.50, token: 'USDC', customer: '0x1234...7890', status: 'completed' },
                        { id: 'tx-3', date: new Date(2025, 1, 22), amount: 32.00, token: 'USDT', customer: 'sarah.sol', status: 'completed' },
                        { id: 'tx-4', date: new Date(2025, 1, 20), amount: 27.75, token: 'ETH', customer: '0xabcd...ef12', status: 'completed' }
                    ];

                    const mockSalesMetrics = {
                        totalSales: 5842.50,
                        thisMonth: 1245.75,
                        lastMonth: 1120.30,
                        percentChange: 11.2
                    };

                    setMerchant(mockMerchant);
                    setEditedMerchant(mockMerchant);
                    setTokens(mockTokens);
                    setTransactions(mockTransactions);
                    setSalesMetrics(mockSalesMetrics);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditToggle = () => {
        if (editing) {
            setEditedMerchant(merchant);
        }
        setEditing(!editing);
    };

    const handleInputChange = (field: string, value: string) => {
        if (!editedMerchant) return;

        setEditedMerchant({
            ...editedMerchant,
            [field]: value
        });
    };

    const handleThemeChange = (field: string, value: string) => {
        if (!editedMerchant) return;

        setEditedMerchant({
            ...editedMerchant,
            theme: {
                ...editedMerchant.theme,
                [field]: value
            }
        });
    };

    const handleSaveChanges = async () => {
        setLoading(true);

        try {
            // In a real application, this would be an API call
            setTimeout(() => {
                setMerchant(editedMerchant);
                setEditing(false);
                setLoading(false);
                toast("Your profile has been updated successfully.");
            }, 800);
        } catch (error) {
            console.error('Error saving changes:', error);
            setLoading(false);
            toast("Failed to save changes. Please try again.");
        }
    };

    const handleTokenSelection = (tokenId: string) => {
        if (!editedMerchant) return;

        const updatedTokens = editedMerchant.supportedTokens.includes(tokenId)
            ? editedMerchant.supportedTokens.filter(id => id !== tokenId)
            : [...editedMerchant.supportedTokens, tokenId];

        setEditedMerchant({
            ...editedMerchant,
            supportedTokens: updatedTokens
        });
    };

    const handleShareProfile = () => {
        // In a real application, this would copy a URL to clipboard
        if (!merchant) return;
        const url = `${window.location.origin}${merchant.publicProfileUrl}`;
        navigator.clipboard.writeText(url);
        toast("Profile link has been copied to clipboard.");
    };

    const getTokenById = (tokenId: string) => {
        return tokens.find(token => token.id === tokenId || token.symbol === tokenId);
    };

    // Format a date to a readable string
    const formatDate = (date: string | number | Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format a currency value
    const formatCurrency = (value: string | number | bigint) => {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(numericValue);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center">
            <div className="container max-w-6xl py-10 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {!editing ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="rounded-full px-5 py-2 border-2 shadow-sm hover:shadow transition-all gap-2 border-slate-200 hover:border-slate-300"
                                    onClick={handleShareProfile}
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share Profile
                                </Button>

                                <Link href={merchant?.id || "#"}>
                                    <Button
                                        variant="outline"
                                        className="rounded-full px-5 py-2 border-2 shadow-sm hover:shadow transition-all gap-2 border-slate-200 hover:border-slate-300"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Profile
                                    </Button>
                                </Link>

                                <Button
                                    className="rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all gap-2"
                                    onClick={handleEditToggle}
                                    style={{
                                        backgroundColor: merchant?.theme?.accentColor || '#4F46E5',
                                        color: merchant?.theme?.buttonTextColor || 'white'
                                    }}
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="rounded-full px-5 py-2 border-2 shadow-sm hover:shadow transition-all gap-2 border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50"
                                    onClick={handleEditToggle}
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>

                                <Button
                                    className="rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all gap-2"
                                    onClick={handleSaveChanges}
                                    style={{
                                        backgroundColor: merchant?.theme?.accentColor || '#4F46E5',
                                        color: merchant?.theme?.buttonTextColor || 'white'
                                    }}
                                >
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full mx-auto">

                    {/* Profile Header */}
                    <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {loading ? (
                                <Skeleton className="w-32 h-32 rounded-2xl" />
                            ) : (
                                <div
                                    className="w-32 h-32 rounded-2xl overflow-hidden border-4 shadow-lg flex items-center justify-center relative"
                                    style={{
                                        borderColor: merchant?.theme?.accentColor || '#4F46E5',
                                        backgroundColor: merchant?.theme?.cardBackground || 'white'
                                    }}
                                >
                                    <img
                                        src={merchant?.logoUrl}
                                        alt={merchant?.businessName}
                                        className="w-full h-full object-cover"
                                    />

                                    {editing && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-white bg-black/20 hover:bg-black/40 rounded-full p-2"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
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
                                    <div className="w-full">
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                            {editing ? (
                                                <Input
                                                    value={editedMerchant?.businessName}
                                                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                                                    className="text-xl md:text-2xl font-bold font-display h-auto py-2 px-4 rounded-lg border-2"
                                                    style={{
                                                        borderColor: `${merchant?.theme?.accentColor}40`,
                                                    }}
                                                />
                                            ) : (
                                                <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-800">{merchant?.businessName}</h1>
                                            )}

                                            {merchant?.verified && (
                                                <Badge
                                                    variant="outline"
                                                    className="h-7 px-3 gap-1 ml-0 md:ml-2 mx-auto md:mx-0 w-fit rounded-full shadow-sm"
                                                    style={{
                                                        backgroundColor: `${merchant?.theme?.accentColor}20`,
                                                        borderColor: `${merchant?.theme?.accentColor}40`,
                                                        color: merchant?.theme?.accentColor
                                                    }}
                                                >
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>

                                        {editing ? (
                                            <Textarea
                                                value={editedMerchant?.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                className="text-md mb-4 rounded-lg border-2 px-4"
                                                rows={3}
                                                style={{
                                                    borderColor: `${merchant?.theme?.accentColor}40`,
                                                }}
                                            />
                                        ) : (
                                            <p className="text-md text-slate-600 mb-6 leading-relaxed">{merchant?.description}</p>
                                        )}

                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                                            {editing ? (
                                                <Select
                                                    value={editedMerchant?.industry}
                                                    onValueChange={(value) => handleInputChange('industry', value)}
                                                >
                                                    <SelectTrigger className="w-[200px] rounded-full border-2 shadow-sm" style={{ borderColor: `${merchant?.theme?.accentColor}40` }}>
                                                        <SelectValue placeholder="Select industry" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                                        <SelectItem value="Retail">Retail</SelectItem>
                                                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                                                        <SelectItem value="Technology">Technology</SelectItem>
                                                        <SelectItem value="Services">Services</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1.5 px-4 py-2 text-sm rounded-full shadow-sm"
                                                    style={{
                                                        backgroundColor: `${merchant?.theme?.accentColor}15`,
                                                        color: merchant?.theme?.textColor
                                                    }}
                                                >
                                                    <Tag className="h-4 w-4" />
                                                    <span>{merchant?.industry}</span>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sales metrics dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Card
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            style={{
                                backgroundColor: merchant?.theme?.cardBackground || 'white',
                                borderColor: `${merchant?.theme?.accentColor}30`,
                                color: merchant?.theme?.textColor
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium opacity-70">Total Sales</h3>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}>
                                        <DollarSign className="h-5 w-5" style={{ color: merchant?.theme?.accentColor }} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{formatCurrency(salesMetrics.totalSales)}</div>
                                <div className="text-xs opacity-70">Lifetime</div>
                            </CardContent>
                        </Card>

                        <Card
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            style={{
                                backgroundColor: merchant?.theme?.cardBackground || 'white',
                                borderColor: `${merchant?.theme?.accentColor}30`,
                                color: merchant?.theme?.textColor
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium opacity-70">This Month</h3>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}>
                                        <BarChart2 className="h-5 w-5" style={{ color: merchant?.theme?.accentColor }} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{formatCurrency(salesMetrics.thisMonth)}</div>
                                <div className="text-xs">
                                    <span className={`font-medium ${salesMetrics.percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                                        {salesMetrics.percentChange >= 0 ? "+" : ""}{salesMetrics.percentChange}%
                                    </span> <span className="opacity-70">from last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            style={{
                                backgroundColor: merchant?.theme?.cardBackground || 'white',
                                borderColor: `${merchant?.theme?.accentColor}30`,
                                color: merchant?.theme?.textColor
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium opacity-70">Last Month</h3>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}>
                                        <Clock className="h-5 w-5" style={{ color: merchant?.theme?.accentColor }} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{formatCurrency(salesMetrics.lastMonth)}</div>
                                <div className="text-xs opacity-70">Previous 30 days</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent my-10 opacity-50" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            style={{
                                backgroundColor: merchant?.theme?.cardBackground || 'white',
                                borderColor: `${merchant?.theme?.accentColor}30`,
                                color: merchant?.theme?.textColor
                            }}
                        >
                            <CardHeader className="pb-2 border-b border-slate-100">
                                <CardTitle className="text-xl font-display flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}>
                                        <Activity className="h-4 w-4" style={{ color: merchant?.theme?.accentColor }} />
                                    </div>
                                    Recent Transactions
                                </CardTitle>
                                <CardDescription style={{ color: `${merchant?.theme?.textColor}80` }}>
                                    Your most recent payment activities.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                                {loading ? (
                                    <div className="space-y-4 p-2">
                                        {[...Array(4)].map((_, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="font-semibold">Date</TableHead>
                                                    <TableHead className="font-semibold">Customer</TableHead>
                                                    <TableHead className="font-semibold">Token</TableHead>
                                                    <TableHead className="text-right font-semibold">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transactions.map((tx) => (
                                                    <TableRow key={tx.id} className="hover:bg-slate-50">
                                                        <TableCell className="font-medium">{formatDate(tx.date)}</TableCell>
                                                        <TableCell>{tx.customer}</TableCell>
                                                        <TableCell>
                                                            <span className="inline-flex items-center gap-1">
                                                                <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}></span>
                                                                {tx.token}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">{formatCurrency(tx.amount)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t border-slate-100 p-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-center rounded-lg font-medium"
                                    style={{ color: merchant?.theme?.accentColor }}
                                >
                                    View All Transactions
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Accepting Tokens Section */}
                        <Card
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            style={{
                                backgroundColor: merchant?.theme?.cardBackground || 'white',
                                borderColor: `${merchant?.theme?.accentColor}30`,
                                color: merchant?.theme?.textColor
                            }}
                        >
                            <CardHeader className="pb-2 border-b border-slate-100">
                                <CardTitle className="text-xl font-display flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}>
                                        <Coins className="h-4 w-4" style={{ color: merchant?.theme?.accentColor }} />
                                    </div>
                                    Accepting Tokens
                                </CardTitle>
                                <CardDescription style={{ color: `${merchant?.theme?.textColor}80` }}>
                                    {editing ? "Select which cryptocurrencies you accept." : "You accept the following cryptocurrencies."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                                {loading ? (
                                    <div className="space-y-4 p-2">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Skeleton className="w-12 h-12 rounded-full" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2 p-2">
                                        {editing ? (
                                            <>
                                                {tokens.map((token) => {
                                                    const isSelected = editedMerchant?.supportedTokens.includes(token.id);
                                                    return (
                                                        <div
                                                            key={token.id}
                                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'shadow-sm' : 'hover:bg-slate-50'}`}
                                                            onClick={() => handleTokenSelection(token.id)}
                                                            style={isSelected ? { backgroundColor: `${merchant?.theme?.accentColor}10` } : {}}
                                                        >
                                                            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-sm"
                                                                style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}
                                                            >
                                                                <img
                                                                    src={token.iconUrl}
                                                                    alt={token.name}
                                                                    className="w-8 h-8 object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{token.name}</div>
                                                                <div className="text-xs opacity-70">{token.symbol}</div>
                                                            </div>
                                                            <div className="w-6 h-6 rounded-full flex items-center justify-center"
                                                                style={{
                                                                    backgroundColor: isSelected ? merchant?.theme?.accentColor : 'transparent',
                                                                    border: isSelected ? 'none' : '2px solid #e2e8f0'
                                                                }}
                                                            >
                                                                {isSelected && <Check className="h-4 w-4 text-white" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <>
                                                {merchant?.supportedTokens.map((tokenId) => {
                                                    const token = getTokenById(tokenId);
                                                    if (!token) return null;

                                                    return (
                                                        <div key={tokenId} className="flex items-center gap-3 p-3 rounded-xl">
                                                            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-sm"
                                                                style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}
                                                            >
                                                                <img
                                                                    src={token.iconUrl}
                                                                    alt={token.name}
                                                                    className="w-8 h-8 object-contain"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{token.name}</div>
                                                                <div className="text-xs opacity-70">{token.symbol}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Display and Theme Settings (only visible when editing) */}
                    {editing && (
                        <div className="mt-10">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${merchant?.theme?.accentColor}20` }}>
                                    <Palette className="h-4 w-4" style={{ color: merchant?.theme?.accentColor }} />
                                </div>
                                Theme Settings
                            </h2>
                            <Card
                                className="rounded-xl overflow-hidden shadow-md"
                                style={{
                                    backgroundColor: merchant?.theme?.cardBackground || 'white',
                                    borderColor: `${merchant?.theme?.accentColor}30`,
                                    color: merchant?.theme?.textColor
                                }}
                            >
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium mb-3">Accent Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={editedMerchant?.theme?.accentColor}
                                                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border-2 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    value={editedMerchant?.theme?.accentColor}
                                                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                                                    className="flex-1 rounded-lg border-2 h-12"
                                                    style={{ borderColor: `${merchant?.theme?.accentColor}30` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-3">Text Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={editedMerchant?.theme?.textColor}
                                                    onChange={(e) => handleThemeChange('textColor', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border-2 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    value={editedMerchant?.theme?.textColor}
                                                    onChange={(e) => handleThemeChange('textColor', e.target.value)}
                                                    className="flex-1 rounded-lg border-2 h-12"
                                                    style={{ borderColor: `${merchant?.theme?.accentColor}30` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-3">Card Background</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={editedMerchant?.theme?.cardBackground}
                                                    onChange={(e) => handleThemeChange('cardBackground', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border-2 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    value={editedMerchant?.theme?.cardBackground}
                                                    onChange={(e) => handleThemeChange('cardBackground', e.target.value)}
                                                    className="flex-1 rounded-lg border-2 h-12"
                                                    style={{ borderColor: `${merchant?.theme?.accentColor}30` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-3">Button Text Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={editedMerchant?.theme?.buttonTextColor}
                                                    onChange={(e) => handleThemeChange('buttonTextColor', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border-2 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    value={editedMerchant?.theme?.buttonTextColor}
                                                    onChange={(e) => handleThemeChange('buttonTextColor', e.target.value)}
                                                    className="flex-1 rounded-lg border-2 h-12"
                                                    style={{ borderColor: `${merchant?.theme?.accentColor}30` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
