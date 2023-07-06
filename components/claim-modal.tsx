import {
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { Abi, formatEther, parseEther } from "viem";
import { useCallback, useEffect, useMemo } from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deployments } from "@/lib/deployments";
import DnftAbi from "@/abis/dnft.json";
import WalletButton from "./ui/wallet-button";
import Loader from "./loader";

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

export function ClaimModal({ showModal, closeModal }: Props) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const dnftAddress = useMemo(
    () =>
      (chain && deployments[chain.id]
        ? deployments[chain.id].dnft
        : Object.values(deployments)[0].dnft) as `0x${string}`,
    [chain]
  );

  const { data } = useContractReads({
    contracts: [
      {
        address: dnftAddress,
        abi: DnftAbi as Abi,
        functionName: "START_PRICE",
      },
      {
        address: dnftAddress,
        abi: DnftAbi as Abi,
        functionName: "PRICE_INCREASE",
      },
      {
        address: dnftAddress,
        abi: DnftAbi as Abi,
        functionName: "publicMints",
      },
    ],
  });

  const {
    data: txData,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite({
    address: dnftAddress,
    abi: DnftAbi as Abi,
    functionName: "mintNft",
  });

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: txData?.hash,
  });

  const { startPrice, priceIncrease, publicMints } = useMemo(() => {
    const startPrice = data?.[0]?.result as bigint;
    const priceIncrease = data?.[1]?.result as bigint;
    const publicMints = data?.[2]?.result as bigint;
    return { startPrice, priceIncrease, publicMints };
  }, [data]);

  const mintPrice = useMemo(() => {
    if (!startPrice || !priceIncrease || !publicMints) return 0;
    return formatEther(startPrice + priceIncrease * publicMints);
  }, [startPrice, priceIncrease, publicMints]);

  const mintNft = useCallback(() => {
    if (!address) {
      console.error("Not connected");
    } else if (mintPrice) {
      write({
        args: [address],
        value: parseEther(mintPrice),
      });
    }
  }, [address, mintPrice, write]);

  useEffect(() => {
    if (isSuccess && !isTxLoading) {
      closeModal();
    }
  }, [isSuccess, isTxLoading, closeModal]);

  return (
    showModal && (
      <div
        className="fixed w-screen h-screen flex items-center justify-center bg-black/[0.6] z-10"
        onClick={closeModal}
      >
        <Card
          className="p-4 w-80 max-w-screen-sm flex flex-col justify-start items-left min-w-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CardTitle className="test-md">Claim dNFT</CardTitle>
          <CardContent className="px-0 py-2 text-sm">
            Claim fee {mintPrice} ETH
          </CardContent>
          {address ? (
            <Button className="mt-2" onClick={mintNft}>
              {isLoading || isTxLoading ? (
                <Loader />
              ) : (
                `Claim dNFT No. ${(publicMints + BigInt(1)).toString()}`
              )}
            </Button>
          ) : (
            <WalletButton className="mt-2" />
          )}
        </Card>
      </div>
    )
  );
}