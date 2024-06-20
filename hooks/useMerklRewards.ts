import { keroseneAddress } from "@/generated";
import { defaultChain } from "@/lib/config";
import { error } from "console";
import { useCallback, useEffect, useState } from "react"

type MerklRewards = {
    accumulated: bigint,
    decimals: number,
    proof: `0x${string}`[],
    unclaimed: bigint,
}

export const useMerklRewards = ({ address }: { address: `0x${string}` | undefined }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [merklRewards, setMerklRewards] = useState<MerklRewards | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const getMerklRewards = useCallback(async (address: `0x${string}`) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.merkl.xyz/v3/rewards?user=${address}&chainIds=1`);
            const data = await res.json()

            const rewards = data["1"].tokenData[keroseneAddress[defaultChain.id]];

            console.log(rewards)
            if (rewards) {
                setMerklRewards({
                    accumulated: BigInt(rewards.accumulated),
                    decimals: rewards.decimals,
                    proof: rewards.proof,
                    unclaimed: BigInt(rewards.unclaimed),
                });
            }
        } catch (e) {
            setError("Error fetching rewards. Please try again later.")
        }
        setLoading(false)
    }, [setLoading, setError, setMerklRewards])

    useEffect(() => {
        if (address) {
            getMerklRewards(address);
        }
    }, [address, getMerklRewards])

    return {
        merklRewards,
        loading,
        error,
        refetch: getMerklRewards
    };
}