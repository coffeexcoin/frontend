"use client";

import { useState } from "react";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { DialogClose } from "@/components/ui/dialog";
import { BigIntInput } from "@/components/reusable/BigIntInput";
import { formatNumber, fromBigNumber, toBigNumber } from "@/lib/utils";
import { Address, erc20Abi, maxUint256 } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useTransactionStore } from "@/lib/store";
import {
  useReadDyadMintedDyad,
  useReadVaultManagerMinCollaterizationRatio,
  vaultManagerAbi,
  vaultManagerAddress,
  wEthVaultAbi,
} from "@/generated";
import { defaultChain } from "@/lib/config";

interface EditVaultTabContentProps {
  action: "deposit" | "withdraw" | "redeem";
  vaultAddress: Address;
  token: Address;
  symbol: string;
  collateralizationRatio: bigint | undefined;
  tokenId: string;
}

const EditVaultTabContent: React.FC<EditVaultTabContentProps> = ({
  action,
  token,
  symbol,
  collateralizationRatio,
  tokenId,
  vaultAddress,
}) => {
  const [inputValue, setInputValue] = useState("");
  const { address } = useAccount();
  const { setTransactionData } = useTransactionStore();

  const { data: mintedDyad } = useReadDyadMintedDyad({
    args: [BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: collateralValue } = useReadContract({
    address: vaultAddress,
    abi: wEthVaultAbi,
    functionName: "getUsdValue",
    args: [BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: assetValue } = useReadContract({
    address: vaultAddress,
    abi: wEthVaultAbi,
    functionName: "assetPrice",
    chainId: defaultChain.id,
  });

  const { data: allowance } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, vaultManagerAddress[defaultChain.id]],
    chainId: defaultChain.id,
  });

  const { data: minCollateralizationRatio } =
    useReadVaultManagerMinCollaterizationRatio({ chainId: defaultChain.id });

  const newCr =
    ((fromBigNumber(collateralValue) +
      (action === "deposit"
        ? fromBigNumber(inputValue) * fromBigNumber(assetValue, 8)
        : -fromBigNumber(inputValue) * fromBigNumber(assetValue, 8))) /
      fromBigNumber(mintedDyad)) *
    100;

  const { data: balance } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
  });

  const maxHandler = () => {
    if (action === "deposit") {
      setInputValue(balance?.toString() || "0");
    }
    if (action === "withdraw") {
      const theoreticalMax = toBigNumber(
        (fromBigNumber(collateralValue) -
          fromBigNumber(mintedDyad) *
            fromBigNumber(minCollateralizationRatio)) /
          fromBigNumber(assetValue, 8)
      );
      setInputValue((theoreticalMax - toBigNumber(0.000001)).toString());
    }

    if (action === "redeem") {
      setInputValue((mintedDyad || 0n).toString());
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-5 w-full">
        <div className="w-5/6 ">
          <BigIntInput
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            placeholder={`Amount of ${action === "redeem" ? "DYAD" : symbol} to ${action}...`}
          />
        </div>
        <div className="w-[74px]">
          <ButtonComponent onClick={maxHandler} variant="bordered">
            Max
          </ButtonComponent>
        </div>
      </div>
      {mintedDyad !== 0n && !!mintedDyad && action !== "redeem" && (
        <div className="flex flex-col w-full justify-between font-semibold text-sm">
          <div className="flex text-[#A1A1AA]">
            <div className="mr-[5px]">Current collateralization ratio:</div>
            <p>{formatNumber(fromBigNumber(collateralizationRatio, 16))}%</p>
          </div>
          <div className="flex">
            <div className="mr-[5px] ">New collateralization ratio:</div>
            <div>{formatNumber(newCr)}%</div>
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {allowance === 0n && action === "deposit" ? (
          <div className="w-[100px]">
            <ButtonComponent
              onClick={() =>
                setTransactionData({
                  config: {
                    address: token,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [vaultManagerAddress[defaultChain.id], maxUint256],
                  },
                  description: "Approve collateral for deposit",
                })
              }
            >
              Approve
            </ButtonComponent>
          </div>
        ) : (
          <DialogClose>
            <ButtonComponent
              onClick={() => {
                setTransactionData({
                  config: {
                    address: vaultManagerAddress[defaultChain.id],
                    abi: vaultManagerAbi,
                    functionName: action === "redeem" ? "redeemDyad" : action,
                    args:
                      action === "deposit"
                        ? [tokenId, vaultAddress, inputValue]
                        : [tokenId, vaultAddress, inputValue, address],
                  },
                  description: `${action} ${formatNumber(fromBigNumber(inputValue), 4)} ${action === "redeem" ? "DYAD" : symbol}`,
                });
                setInputValue("");
              }}
              disabled={!inputValue}
              variant="solid"
            >
              <p className="capitalize">{action}</p>
            </ButtonComponent>
          </DialogClose>
        )}

        <DialogClose>
          <ButtonComponent variant="bordered">Cancel</ButtonComponent>
        </DialogClose>
      </div>
    </div>
  );
};
export default EditVaultTabContent;
