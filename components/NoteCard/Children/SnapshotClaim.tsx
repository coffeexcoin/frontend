import ButtonComponent from "@/components/reusable/ButtonComponent";
import {
  useReadMerkleClaimErc20HasClaimed,
  useSimulateMerkleClaimErc20Claim,
  useWriteMerkleClaimErc20Claim,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import claimData from "@/lib/snapshot-data.json";
import MerkleTree from "merkletreejs";
import { useMemo } from "react";
import { encodePacked, formatEther, getAddress, keccak256, parseEther } from "viem";
import { useAccount } from "wagmi";

export const SnapshotClaim = () => {
  const getLeaf = (address: string, amount: bigint) =>
    Buffer.from(
      keccak256(
        encodePacked(["address", "uint256"], [getAddress(address), amount])
      ).slice(2),
      "hex"
    );

  const tree = useMemo(() => {
    const leaves = claimData.map((data) =>
      getLeaf(data.address, parseEther(data.amount))
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    return tree;
  }, []);

  const { address } = useAccount();

  const claimAmount = useMemo(() => {
    const data = claimData.find(
      (data) => data.address.toLowerCase() === address?.toLowerCase()
    );
    return parseEther(data?.amount || "0");
  }, [address]);

  const { data: hasClaimed } = useReadMerkleClaimErc20HasClaimed({
    args: [address!],
    chainId: defaultChain.id,
    query: {
      enabled: !!address,
    },
  });

  const proof = useMemo(() => {
    if (!address) return [];

    return tree
      .getHexProof(getLeaf(address, claimAmount))
      .map((p) => p as `0x${string}`);
  }, [address, claimAmount, tree]);

  const { data: merkleClaimConfig, error } = useSimulateMerkleClaimErc20Claim({
    query: {
      enabled: !!address && !hasClaimed,
    },
    args: [address!, claimAmount, proof],
  });

  const { writeContract } = useWriteMerkleClaimErc20Claim();

  return (
    <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
      {!address && <p>Connect your wallet to claim KEROSENE</p>}
      {!hasClaimed && error && <p className="text-red-500">{error.message}</p>}

      {hasClaimed ? (
        <p className="text-green-500">
          Claimed {formatEther(claimAmount)} KEROSENE
        </p>
      ) : claimAmount > 0 ? (
        <>
          <p>Eligible for {formatEther(claimAmount)} KEROSENE</p>
          <ButtonComponent
            onClick={() => {
              writeContract(merkleClaimConfig!.request);
            }}
          >
            Claim
          </ButtonComponent>
        </>
      ) : (
        <p>Not eligible for any KEROSENE</p>
      )}
    </div>
  );
};
