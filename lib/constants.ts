import {
  wEthVaultAddress,
  wstEthAddress,
  wethAddress,
  wstEthVaultAddress,
  keroseneAddress,
  keroseneVaultAddress,
  keroseneVaultV2Address,
  tBtcVaultAddress,
  tBtcAddress,
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
    vaultAddress: keroseneVaultV2Address[defaultChain.id],
    symbol: "KEROSENE",
    tokenAddress: keroseneAddress[defaultChain.id],
  },
  {
    vaultAddress: tBtcVaultAddress[defaultChain.id],
    symbol: "tBTC",
    tokenAddress: tBtcAddress[defaultChain.id],
  },
];
