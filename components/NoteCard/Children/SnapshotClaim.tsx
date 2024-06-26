import ButtonComponent from "@/components/reusable/ButtonComponent";
import {
  keroseneDnftClaimAddress,
  useReadDNftBalanceOf,
  useReadKeroseneAllowance,
  useReadKeroseneBalanceOf,
  useReadKeroseneDnftClaimPrice,
  useReadKeroseneDnftClaimPurchased,
  useReadMerkleClaimErc20HasClaimed,
  useSimulateKeroseneApprove,
  useSimulateKeroseneDnftClaimBuyNote,
  useSimulateMerkleClaimErc20Claim,
  useWriteKeroseneApprove,
  useWriteKeroseneDnftClaimBuyNote,
  useWriteMerkleClaimErc20Claim,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import claimData from "@/lib/snapshot-data.json";
import MerkleTree from "merkletreejs";
import { useEffect, useMemo } from "react";
import {
  encodeAbiParameters,
  encodePacked,
  formatEther,
  getAddress,
  keccak256,
  parseEther,
} from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";

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
    keccak256(
      encodeAbiParameters([{ type: "address" }], [getAddress(address)])
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

  const { data: hasClaimed, refetch: reloadHasClaimed } =
    useReadMerkleClaimErc20HasClaimed({
      args: [address!],
      chainId: defaultChain.id,
      query: {
        enabled: !!address,
      },
    });

  const { data: buyNotePrice } = useReadKeroseneDnftClaimPrice({
    chainId: defaultChain.id,
  });

  const { data: remainingPurchases } = useReadDNftBalanceOf({
    args: [keroseneDnftClaimAddress[defaultChain.id]],
  });

  const { data: purchasedNote, refetch: reloadPurchaseStatus } =
    useReadKeroseneDnftClaimPurchased({
      args: [address!],
      chainId: defaultChain.id,
      query: {
        enabled: !!address,
      },
    });

  const { data: keroseneBalance, refetch: reloadKeroseneBalance } =
    useReadKeroseneBalanceOf({
      chainId: defaultChain.id,
      args: [address!],
      query: {
        enabled: !!address,
        refetchInterval: 10000,
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

  const { data: keroseneApprovalConfig, error: keroseneApprovalError } =
    useSimulateKeroseneApprove({
      args: [keroseneDnftClaimAddress[defaultChain.id], buyNotePrice || 0n],
      query: {
        enabled: !!address && (keroseneAllowance || 0n) < buyNotePrice!,
      },
    });

  const {
    writeContract: approveKerosene,
    data: approveKeroseneTransactionHash,
  } = useWriteKeroseneApprove();

  const buyProof = useMemo(() => {
    if (!address) return [];

    return buyNoteTree
      .getHexProof(getBuyLeaf(address))
      .map((p) => p as `0x${string}`);
  }, [address, buyNoteTree]);

  const { data: buyNoteConfig, error: buyNoteError } =
    useSimulateKeroseneDnftClaimBuyNote({
      query: {
        enabled: !!address && purchasedNote === false,
      },
      args: [buyProof],
    });

  const { writeContract: buyNoteWithKerosene, data: buyNoteTransactionHash } =
    useWriteKeroseneDnftClaimBuyNote();

  const claimProof = useMemo(() => {
    if (!address) return [];

    return claimTree
      .getHexProof(getClaimLeaf(address, claimAmount))
      .map((p) => p as `0x${string}`);
  }, [address, claimAmount, claimTree]);

  const { data: merkleClaimConfig, error }: { data: any; error: any } =
    useSimulateMerkleClaimErc20Claim({
      query: {
        enabled: !!address && !hasClaimed,
      },
      args: [address!, claimAmount, claimProof],
    });

  const { writeContract, data: claimKeroseneTransactionHash } =
    useWriteMerkleClaimErc20Claim();

  const { data: keroseneClaimReceipt } = useWaitForTransactionReceipt({
    hash: claimKeroseneTransactionHash,
  });

  const { data: keroseneApprovalReceipt } = useWaitForTransactionReceipt({
    hash: approveKeroseneTransactionHash,
  });

  const { data: buyNoteTransactionReceipt } = useWaitForTransactionReceipt({
    hash: buyNoteTransactionHash,
  });

  useEffect(() => {
    if (keroseneClaimReceipt?.status === "success") {
      reloadKeroseneBalance();
      reloadHasClaimed();
    }
  }, [keroseneClaimReceipt, reloadKeroseneBalance, reloadHasClaimed]);

  useEffect(() => {
    if (keroseneApprovalReceipt?.status === "success") {
      reloadAllowance();
    }
  }, [keroseneApprovalReceipt, reloadAllowance]);

  useEffect(() => {
    if (buyNoteTransactionReceipt?.status === "success") {
      reloadPurchaseStatus();
    }
  }, [buyNoteTransactionReceipt, reloadPurchaseStatus]);

  return (
    <div>
      <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
        {!address && <p>Connect your wallet to claim KEROSENE</p>}
        {!hasClaimed &&
          error &&
          error.cause?.data?.errorName !== "NotInMerkle" && (
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
      {remainingPurchases !== undefined && remainingPurchases !== 0n && (
        <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
          <p className="text-[#A1A1AA]">
            Buy Note with Kerosene{" "}
            <b>({remainingPurchases?.toString() || "0"} left)</b>
          </p>
          {keroseneBalance !== undefined &&
            buyNotePrice !== undefined &&
            (purchasedNote === true ? (
              <p>Purchased note with kerosene</p>
            ) : keroseneBalance >= buyNotePrice ? (
              (keroseneAllowance || 0n) >= buyNotePrice ? (
                <ButtonComponent
                  disabled={buyNoteConfig === undefined || !!buyNoteError}
                  onClick={() => {
                    buyNoteWithKerosene(buyNoteConfig!.request);
                  }}
                >
                  Buy note for {formatEther(buyNotePrice || 0n)} KEROSENE
                </ButtonComponent>
              ) : (
                <ButtonComponent
                  onClick={() => {
                    approveKerosene(keroseneApprovalConfig!.request);
                  }}
                >
                  Approve {formatEther(buyNotePrice || 0n)} KEROSENE
                </ButtonComponent>
              )
            ) : (
              <>
                <p>
                  Eligible to buy a note for {formatEther(buyNotePrice || 0n)}{" "}
                  KEROSENE. Current balance is {formatEther(keroseneBalance)}{" "}
                  KEROSENE. Please acquire{" "}
                  {formatEther(buyNotePrice - keroseneBalance)} additional
                  KEROSENE.
                </p>
                <ButtonComponent
                  onClick={() =>
                    window.open(
                      `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xf3768D6e78E65FC64b8F12ffc824452130BD5394&exactField=output&exactAmount=${formatEther(buyNotePrice - keroseneBalance)}`
                    )
                  }
                >
                  Buy on Uniswap
                </ButtonComponent>
              </>
            ))}
        </div>
      )}
    </div>
  );
};
