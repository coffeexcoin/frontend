import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "viem/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;
export const defaultChain = sepolia;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Dyad",
  description: "Dyad Stablecoin",
  url: "https://dyadstable.xyz",
  icons: ["https://dyadstable.xyz/favicon-32x32.png"],
};

const chains = [defaultChain] as const;
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
