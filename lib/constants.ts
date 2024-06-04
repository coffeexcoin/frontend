import {
  wEthVaultAddress,
  wstEthAddress,
  wethAddress,
  wstEthVaultAddress,
  keroseneAddress,
  keroseneVaultAddress,
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
  {
    vaultAddress: keroseneVaultAddress[defaultChain.id],
    symbol: "KEROSENE",
    tokenAddress: keroseneAddress[defaultChain.id],
  },
];
