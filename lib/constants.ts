import {
  wEthVaultAddress,
  wstEthAddress,
  wethAddress,
  wstEthVaultAddress,
  keroseneAddress,
  keroseneVaultAddress,
  keroseneVaultV2Address,
} from "@/generated";
import {defaultChain} from "@/lib/config";

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
    symbol: "KEROSENE - OLD",
    tokenAddress: keroseneAddress[defaultChain.id],
  },
  {
    vaultAddress: keroseneVaultV2Address[defaultChain.id],
    symbol: "KEROSENE - NEW",
    tokenAddress: keroseneAddress[defaultChain.id],
  },
];
