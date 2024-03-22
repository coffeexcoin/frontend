import { Network, Alchemy } from "alchemy-sdk";

export const alchemySdk = new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET
})