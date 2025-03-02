
export interface Token {
    id: string;
    name: string;
    symbol: string;
    iconUrl: string;
    price: number; // USD price
    change24h: number; // 24h percent change
  }
  
  export const tokens: Token[] = [
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      iconUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
      price: 138.45,
      change24h: 5.2,
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      price: 1.0,
      change24h: 0.1,
    },
    {
      id: "bonk",
      name: "Bonk",
      symbol: "BONK",
      iconUrl: "https://cryptologos.cc/logos/bonk-bonk-logo.png",
      price: 0.00002145,
      change24h: 12.4,
    },
    {
      id: "jupiter",
      name: "Jupiter",
      symbol: "JUP",
      iconUrl: "https://cryptologos.cc/logos/jupiter-jup-logo.png",
      price: 1.23,
      change24h: -3.5,
    },
  ];
  
  export function getTokenById(id: string): Token | undefined {
    return tokens.find((token) => token.id === id);
  }
  
  export function convertUsdToToken(usdAmount: number, tokenId: string): number {
    const token = getTokenById(tokenId);
    if (!token) return 0;
    
    return usdAmount / token.price;
  }
  
  export function formatCurrency(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  }