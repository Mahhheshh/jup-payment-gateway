import { Connection } from "@solana/web3.js";

export const QUOTE_URI = "https://api.jup.ag/swap/v1/quote";
export const SWAP_URI = "https://api.jup.ag/swap/v1/swap";
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const USDC_MINT_DEVNET = "4efv22o3Zc8oJ9DXLqeSCgM5vYibNCaLie79SkjeW1tH";

export const connection = new Connection(process.env.MAIN_NET_RPC_ENDPOINT!);
