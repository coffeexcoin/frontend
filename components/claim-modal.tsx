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
      {
        address: dnftAddress,
        abi: DnftAbi as Abi,
        functionName: "insiderMints",
      },
    ],
  });

  const {
    data: txData,
    isLoading,
    isSuccess,
    isError,
    write,
    reset,
  } = useContractWrite({
    address: dnftAddress,
    abi: DnftAbi as Abi,
    functionName: "mintNft",
  });

  const {
    isLoading: isTxLoading,
    isError: isTxError,
    error,
  } = useWaitForTransaction({
    hash: txData?.hash,
  });

  const { startPrice, priceIncrease, publicMints, insiderMints } =
    useMemo(() => {
      let startPrice = BigInt(0);
      let priceIncrease = BigInt(0);
      let publicMints = BigInt(0);
      let insiderMints = BigInt(0);
      if (data?.[0]?.result) startPrice = data[0].result as bigint;
      if (data?.[1]?.result) priceIncrease = data?.[1]?.result as bigint;
      if (data?.[2]?.result) publicMints = data?.[2]?.result as bigint;
      if (data?.[3]?.result) insiderMints = data?.[3]?.result as bigint;
      console.log(data);
      return { startPrice, priceIncrease, publicMints, insiderMints };
    }, [data]);

  const mintPrice = useMemo(() => {
    if (
      startPrice === undefined ||
      priceIncrease === undefined ||
      publicMints === undefined
    )
      return 0;
    try {
      return formatEther(startPrice + priceIncrease * publicMints);
    } catch (err) {
      return 0;
    }
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

  const close = useCallback(() => {
    reset();
    closeModal();
  }, [reset, closeModal]);

  useEffect(() => {
    if (isTxError) {
      console.error(error);
    }
  }, [isTxError, error]);

  return (
    showModal && (
      <div
        className="fixed w-screen h-screen flex items-center justify-center backdrop-blur-sm bg-black/[0.6] z-10"
        onClick={closeModal}
      >
        <Card
          className="p-4 w-80 max-w-screen-sm flex flex-col justify-start items-left min-w-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CardTitle className="test-md">
            {isError
              ? "Error"
              : isSuccess && !isTxLoading
              ? "Success!"
              : "Claim dNFT"}
          </CardTitle>
          <CardContent className="px-0 py-2 text-sm">
            {isError
              ? "Error sending transaction, please try again"
              : isSuccess && !isTxLoading
              ? "dNFT claimed successfully!"
              : `Claim fee ${mintPrice} ETH`}
          </CardContent>
          {address ? (
            <Button
              className="mt-2"
              onClick={
                isError || isTxError
                  ? reset
                  : isSuccess && !isTxLoading
                  ? close
                  : mintNft
              }
            >
              {isError || isTxError ? (
                "Retry"
              ) : isSuccess && !isTxLoading ? (
                "Close"
              ) : isLoading || isTxLoading ? (
                <Loader />
              ) : (
                `Claim dNFT No. ${(publicMints + insiderMints).toString()}`
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
