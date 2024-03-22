import {
  wEthVaultAddress,
  wstEthAddress,
  wethAddress,
  wstEthVaultAddress,
} from "@/generated";
import { defaultChain } from "@/lib/config";

export const vaultInfo = [
  {
    vaultAddress: wEthVaultAddress[defaultChain.id],
    symbol: "wETH",
    tokenAddress: wethAddress[defaultChain.id],
  },
  {
    vaultAddress: wstEthVaultAddress[defaultChain.id],
    symbol: "wstETH",
    tokenAddress: wstEthAddress[defaultChain.id],
  },
];
