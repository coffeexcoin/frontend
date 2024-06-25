import ButtonComponent from "@/components/reusable/ButtonComponent";
import {
  keroseneDnftClaimAddress,
  useReadKerosene,
  useReadKeroseneAllowance,
  useReadKeroseneBalanceOf,
  useReadKeroseneDnftClaimPrice,
  useReadKeroseneDnftClaimPurchased,
  useReadMerkleClaimErc20HasClaimed,
  useSimulateKeroseneDnftClaimBuyNote,
  useSimulateMerkleClaimErc20Claim,
  useWriteKeroseneDnftClaimBuyNote,
  useWriteMerkleClaimErc20Claim,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import claimData from "@/lib/snapshot-data.json";
import MerkleTree from "merkletreejs";
import { useMemo } from "react";
import {
  encodePacked,
  formatEther,
  getAddress,
  keccak256,
  parseEther,
} from "viem";
import { useAccount } from "wagmi";

export const SnapshotClaim = () => {
  const getClaimLeaf = (address: string, amount: bigint) =>
    Buffer.from(
      keccak256(
        encodePacked(["address", "uint256"], [getAddress(address), amount])
      ).slice(2),
      "hex"
    );

  const claimTree = useMemo(() => {
    const leaves = claimData.map((data) =>
      getClaimLeaf(data.address, parseEther(data.amount))
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    return tree;
  }, []);

  const getBuyLeaf = (address: string) =>
    Buffer.from(
      keccak256(encodePacked(["address"], [getAddress(address)])),
      "hex"
    );

  const buyNoteTree = useMemo(() => {
    const leaves = claimData.map((data) => getBuyLeaf(data.address));
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

  const { data: buyNotePrice } = useReadKeroseneDnftClaimPrice({
    chainId: defaultChain.id,
  });

  const { data: purchasedNote } = useReadKeroseneDnftClaimPurchased({
    args: [address!],
    chainId: defaultChain.id,
    query: {
      enabled: !!address,
    },
  });

  const { data: keroseneBalance } = useReadKeroseneBalanceOf({
    chainId: defaultChain.id,
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  const { data: keroseneAllowance, refetch: reloadAllowance } =
    useReadKeroseneAllowance({
      chainId: defaultChain.id,
      args: [address!, keroseneDnftClaimAddress[defaultChain.id]],
      query: {
        enabled: !!address,
      },
    });

  const buyProof = useMemo(() => {
    if (!address) return [];

    return buyNoteTree
      .getHexProof(getBuyLeaf(address))
      .map((p) => p as `0x${string}`);
  }, [address, buyNoteTree]);

  const { data: buyNoteConfig } = useSimulateKeroseneDnftClaimBuyNote({
    query: {
      enabled: !!address && purchasedNote === false,
    },
    args: [buyProof],
  });

  const { writeContract: buyNoteWithKerosene } =
    useWriteKeroseneDnftClaimBuyNote();

  const claimProof = useMemo(() => {
    if (!address) return [];

    return claimTree
      .getHexProof(getClaimLeaf(address, claimAmount))
      .map((p) => p as `0x${string}`);
  }, [address, claimAmount, claimTree]);

  const { data: merkleClaimConfig, error } = useSimulateMerkleClaimErc20Claim({
    query: {
      enabled: !!address && !hasClaimed,
    },
    args: [address!, claimAmount, claimProof],
  });

  const { writeContract } = useWriteMerkleClaimErc20Claim();

  return (
    <div>
      <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
        {!address && <p>Connect your wallet to claim KEROSENE</p>}
        {!hasClaimed && error && (
          <p className="text-red-500">{error.message}</p>
        )}

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
      <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
        <p className="text-[#A1A1AA]">Buy Note with Kerosene</p>
        {keroseneBalance !== undefined &&
          buyNotePrice !== undefined &&
          (purchasedNote === true ? (
            <p>Purchased note with kerosene</p>
          ) : keroseneBalance > buyNotePrice ? (
            <ButtonComponent>
              Buy note for {formatEther(buyNotePrice || 0n)} KEROSENE
            </ButtonComponent>
          ) : (
            <p>Eligible to buy a note for {formatEther(buyNotePrice || 0n)}.</p>
          ))}
      </div>
    </div>
  );
};
