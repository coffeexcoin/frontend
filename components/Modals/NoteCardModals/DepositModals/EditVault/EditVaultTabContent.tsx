"use client";

import { useMemo, useState } from "react";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { DialogClose } from "@/components/ui/dialog";
import { BigIntInput } from "@/components/reusable/BigIntInput";
import { formatNumber, fromBigNumber, toBigNumber } from "@/lib/utils";
import { Address, erc20Abi, maxUint256 } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { useTransactionStore } from "@/lib/store";
import {
  dyadAbi,
  dyadAddress,
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

  const { data: contractData } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: dyadAddress[defaultChain.id],
        abi: dyadAbi,
        functionName: "mintedDyad",
        args: [BigInt(tokenId)],
        chainId: defaultChain.id,
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "getTotalValue",
        args: [BigInt(tokenId)],
        chainId: defaultChain.id,
      },
      {
        address: vaultAddress,
        abi: wEthVaultAbi,
        functionName: "id2asset",
        args: [BigInt(tokenId)],
        chainId: defaultChain.id,
      },
      {
        address: vaultAddress,
        abi: wEthVaultAbi,
        functionName: "assetPrice",
        chainId: defaultChain.id,
      },
      {
        address: token,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, vaultManagerAddress[defaultChain.id]],
        chainId: defaultChain.id,
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "MIN_COLLAT_RATIO",
        chainId: defaultChain.id,
      },
      {
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      }
    ],
    query: {
      select: (data) => ({
        mintedDyad: data[0],
        collateralValue: data[1],
        totalDeposited: data[2],
        assetValue: data[3],
        allowance: data[4],
        minCollateralizationRatio: data[5],
        balance: data[6]
      })
    }
  });

  const newCr =
    ((fromBigNumber(contractData?.collateralValue) +
      (action === "deposit"
        ? fromBigNumber(inputValue) * fromBigNumber(contractData?.assetValue, 8)
        : -fromBigNumber(inputValue) * fromBigNumber(contractData?.assetValue, 8))) /
      fromBigNumber(contractData?.mintedDyad)) *
    100;

  const theoreticalMaxWithdraw = useMemo(() => {
    const totalAssetDeposited = fromBigNumber(contractData?.totalDeposited);
    const price = fromBigNumber(contractData?.assetValue, 8)

    const totalCollateral = fromBigNumber(contractData?.collateralValue)
    const totalDyad = fromBigNumber(contractData?.mintedDyad)
    const minCollateralRatio = fromBigNumber(contractData?.minCollateralizationRatio);

    const maxWithdraw = ((totalCollateral - (totalDyad * minCollateralRatio)) / price) - 0.000001;

    if (maxWithdraw < totalAssetDeposited) {
      return toBigNumber(maxWithdraw);
    }
    return contractData?.totalDeposited;
  }, [contractData]);

  const maxHandler = () => {
    if (action === "deposit") {
      setInputValue(contractData?.balance?.toString() || "0");
    }
    if (action === "withdraw") {
      setInputValue(theoreticalMaxWithdraw?.toString() || "0");
    }

    if (action === "redeem") {
      setInputValue((contractData?.mintedDyad || 0n).toString());
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
      {contractData?.mintedDyad !== 0n && !!contractData?.mintedDyad && action !== "redeem" && (
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
        {contractData?.allowance !== undefined && contractData?.allowance < toBigNumber(inputValue, 0) && action === "deposit" ? (
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
