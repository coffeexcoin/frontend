import { useReadContract, useReadContracts } from "wagmi"
import { vaultManagerAbi } from "@/lib/abi/VaultManager"
import { dnftAbi } from "@/lib/abi/Dnft"
import { useMemo } from "react";
import { formatEther, maxUint256 } from "viem";

export const useNoteHealth = (vaultManager: `0x${string}`, dNft: `0x${string}`) => {

    const { data: totalSupply } = useReadContract({
        abi: dnftAbi,
        address: dNft,
        functionName: "totalSupply",
    });

    const { data: owners } = useReadContracts({
        contracts: Array.from({ length: Number(totalSupply) }, (_, i) => ({
            abi: dnftAbi,
            address: dNft,
            functionName: "ownerOf",
            args: [i],
        })),
        allowFailure: false
    });

    const { data: collatRatios } = useReadContracts({
        contracts: Array.from({ length: Number(totalSupply) }, (_, i) => ({
            abi: vaultManagerAbi,
            address: vaultManager,
            functionName: "collatRatio",
            args: [i],
        })),
        allowFailure: false
    });

    const { data: usdValues } = useReadContracts({
        contracts: Array.from({ length: Number(totalSupply) }, (_, i) => ({
            abi: vaultManagerAbi,
            address: vaultManager,
            functionName: "getTotalUsdValue",
            args: [i],
        })),
        allowFailure: false
    });

    const dnfts = useMemo(() => {
        if (!totalSupply || !owners || !collatRatios || !usdValues) return [];

        const data = owners.map((owner, i) => ({
            id: i,
            owner,
            rawCollatRatio: collatRatios[i] as bigint,
            rawUsdValue: usdValues[i] as bigint
        })).filter(({ rawCollatRatio }) => rawCollatRatio !== maxUint256).map((dnft) => ({
            ...dnft,
            collatRatio: Number(formatEther(dnft.rawCollatRatio * 100n)),
            usdValue: Number(formatEther(dnft.rawUsdValue))
        }));

        data.sort((a, b) => a.collatRatio - b.collatRatio);
        return data;

    }, [totalSupply, owners, collatRatios, usdValues])

    return dnfts;
}