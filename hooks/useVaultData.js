import VaultAbi from "@/abis/Vault.json";
import { useContractReads } from "wagmi";

export default function useVaultData(vault) {
  const { data } = useContractReads({
    watch: true,
    contracts: [
      {
        address: vault,
        abi: VaultAbi["abi"],
        functionName: "asset",
      },
      {
        address: vault,
        abi: VaultAbi["abi"],
        functionName: "symbol",
      },
      {
        address: vault,
        abi: VaultAbi["abi"],
        functionName: "collatPrice",
      },
      {
        address: vault,
        abi: VaultAbi["abi"],
        functionName: "decimals",
      },
      {
        address: vault,
        abi: VaultAbi["abi"],
        functionName: "getUsdValue",
      },
      {
        address: vault,
        abi: VaultAbi["abi"],
        functionName: "totalSupply",
      },
    ],
  });

  return data;
}
