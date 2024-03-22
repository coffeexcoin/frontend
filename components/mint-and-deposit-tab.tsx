import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Abi, formatEther, parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VaultManagerAbi from "@/abis/VaultManager.json";
import PaymentsAbi from "@/abis/Payments.json";
import ERC20 from "@/abis/ERC20.json";
import Loader from "./loader";
import { crColor } from "@/lib/utils";
import useCR from "../hooks/useCR";
import CR from "./cr";
import Info from "./info.tsx";

interface Props {
  setSelectedVaultId: (value: string) => void;
  vaults: {
    address: string;
    asset: string;
    symbol: string;
    collatPrice: string;
  }[];
  vaultManager: string;
  selectedDnft?: string;
  selectedVault?: {
    address: string;
    asset: string;
    symbol: string;
    collatPrice: string;
  };
  collatRatio?: bigint;
  totalValueLocked?: bigint;
  dyadMinted?: bigint;
  minCollateralizationRatio?: bigint;
}

export default function MintAndDepositTab({
  collatRatio,
  selectedVault,
  vault,
  payments,
  weth,
  selectedDnft,
  totalValueLocked,
  dyadMinted,
  minCollateralizationRatio,
  vaultManager,
  usdValue,
}: Props) {
  const { address } = useAccount();
  const [depositInput, setDepositInput] = useState<string>();
  const [mintInput, setMintInput] = useState<string>();
  const [redeemInput, setRedeemInput] = useState<string>();

  const { cr: crAfterDeposit } = useCR(usdValue, dyadMinted, depositInput, 0);
  const { cr: crAfterMint } = useCR(usdValue, dyadMinted, 0, mintInput);

  const [depositAmount, depositAmountError] = useMemo(() => {
    if (depositInput === undefined || depositInput === "") {
      return [undefined, undefined];
    }
    try {
      return [parseEther(depositInput as string), undefined];
    } catch {
      return [undefined, "Invalid input"];
    }
  }, [depositInput]);

  const [mintAmount, mintAmountError] = useMemo(() => {
    if (mintInput === undefined || mintInput === "") {
      return [undefined, undefined];
    }
    try {
      return [parseEther(mintInput as string), undefined];
    } catch {
      return [undefined, "Invalid input"];
    }
  }, [mintInput]);

  const [redeemAmount, redeemAmountError] = useMemo(() => {
    if (redeemInput === undefined || redeemInput === "") {
      return [undefined, undefined];
    }
    try {
      return [parseEther(redeemInput as string), undefined];
    } catch {
      return [undefined, "Invalid input"];
    }
  }, [redeemInput]);

  const { data: balanceData } = useBalance({
    enabled: vault !== undefined,
    address,
    token: vault?.isWrapped ? vault?.asset : undefined,
  });
  console.log("balanceData", balanceData);

  const maxMint = useMemo(() => {
    minCollateralizationRatio = "1700000000000000000";
    if (
      usdValue !== undefined &&
      minCollateralizationRatio !== undefined &&
      dyadMinted !== undefined
    ) {
      const a =
        BigInt(usdValue) / BigInt(minCollateralizationRatio) -
        BigInt(dyadMinted) / BigInt(10 ** 18);

      return BigInt(a);
    } else {
      return BigInt(0);
    }
  }, [minCollateralizationRatio, dyadMinted, usdValue]);

  const { data: allowance } = useContractRead({
    enabled: vault !== undefined,
    address: vault?.asset,
    abi: ERC20 as Abi,
    args: [address, payments as `0x${string}`],
    functionName: "allowance",
    watch: true,
    select: (data) => data as bigint,
  });

  const {
    data: approvalTxData,
    isLoading: isApprovalLoading,
    isError: isApprovalError,
    write: approve,
    reset: approvalReset,
  } = useContractWrite({
    enabled: vault !== undefined,
    address: vault?.asset,
    abi: ERC20 as Abi,
    functionName: "approve",
    args: [payments, depositAmount ?? BigInt(0)],
  });

  const { isLoading: isApprovalTxLoading, isError: isApprovalTxError } =
    useWaitForTransaction({
      hash: approvalTxData?.hash,
      onError: (err) => {
        console.error(err);
        approvalReset();
      },
      onSuccess: () => {
        approvalReset();
      },
    });

  const {
    data: depositTxData,
    isLoading: isDepositLoading,
    isError: isDepositError,
    write: deposit,
    reset: depositReset,
  } = useContractWrite({
    address: payments,
    abi: PaymentsAbi["abi"],
    functionName: "depositETHWithFee",
    args: [selectedDnft, vault?.address],
    value: parseEther((depositInput as string) ?? "0"),
  });

  const {
    data: depositWithFeeTxData,
    isLoading: isDepositWithFeeLoading,
    isError: isDepositWithFeeError,
    write: depositWithFee,
    reset: depositWithFeeReset,
  } = useContractWrite({
    address: payments,
    abi: PaymentsAbi["abi"],
    functionName: "depositWithFee",
    args: [
      selectedDnft,
      vault?.address,
      parseEther((depositInput as string) ?? "0"),
    ],
  });

  const { isLoading: isDepositTxLoading, isError: isDepositTxError } =
    useWaitForTransaction({
      hash: depositTxData?.hash,
      onError: (err) => {
        console.error(err);
        depositReset();
      },
      onSuccess: () => {
        depositReset();
        setDepositInput("");
      },
    });

  const {
    isLoading: isDepositWithFeeTxLoading,
    isError: isDepositWithFeeTxError,
  } = useWaitForTransaction({
    hash: depositWithFeeTxData?.hash,
    onError: (err) => {
      console.error(err);
      depositWithFeeReset();
    },
    onSuccess: () => {
      depositWithFeeReset();
      setDepositInput("");
    },
  });

  const setApproval = useCallback(() => {
    if (
      allowance !== undefined &&
      depositAmount !== undefined &&
      allowance < depositAmount
    ) {
      approve();
    }
  }, [allowance, depositAmount, approve]);

  const requiresApproval = useMemo(
    () =>
      vault !== undefined &&
      vault.requiresApproval &&
      allowance !== undefined &&
      depositAmount !== undefined &&
      allowance < depositAmount,
    [allowance, depositAmount]
  );

  const {
    data: mintTxData,
    isLoading: isMintLoading,
    isError: isMintError,
    write: mint,
    reset: mintReset,
  } = useContractWrite({
    address: vaultManager,
    abi: VaultManagerAbi["abi"],
    functionName: "mintDyad",
    args: [selectedDnft ?? "0", mintAmount ?? BigInt(0), address],
  });

  const { isLoading: isMintTxLoading, isError: isMintTxError } =
    useWaitForTransaction({
      hash: mintTxData?.hash,
      onError: (err) => {
        console.error(err);
        mintReset();
      },
      onSuccess: () => {
        mintReset();
        setMintInput("");
      },
    });

  const newCR = useMemo(() => {
    if ((dyadMinted ?? BigInt(0)) + (mintAmount ?? BigInt(0)) <= BigInt(0)) {
      return undefined;
    }
    return (
      (((totalValueLocked ?? BigInt(0)) +
        ((depositAmount ?? BigInt(0)) *
          BigInt(selectedVault?.collatPrice ?? parseEther("1"))) /
          parseEther("1")) *
        BigInt(10 ** 18)) /
      ((dyadMinted ?? BigInt(0)) + (mintAmount ?? BigInt(0)))
    );
  }, [dyadMinted, totalValueLocked, mintAmount, depositAmount, selectedVault]);

  const {
    data: redeemTxData,
    isLoading: isRedeemLoading,
    isError: isRedeemError,
    write: redeem,
    reset: redeemReset,
  } = useContractWrite({
    address: vaultManager,
    abi: VaultManagerAbi["abi"],
    functionName: "redeemDyad",
    args: [
      selectedDnft ?? "0",
      vault?.address,
      redeemAmount ?? BigInt(0),
      address,
    ],
  });

  const { isLoading: isRedeemTxLoading, isError: isRedeemTxError } =
    useWaitForTransaction({
      hash: redeemTxData?.hash,
      onError: (err) => {
        console.error(err);
        redeemReset();
      },
      onSuccess: () => {
        redeemReset();
        setRedeemInput("");
      },
    });

  return (
    <div>
      {/* Deposit Component */}
      <div className="mb-4 p-4 border">
        <div className="flex space-x-4 items-center">
          <Input
            type="text"
            placeholder="Amount to Deposit"
            className="w-full p-2 border mb-2"
            disabled={!selectedDnft}
            value={depositInput}
            onChange={(e) => {
              setDepositInput(e.target.value);
            }}
          />
          <Info>
            Deposit ETH or wETH into your Note as backing collateral for minting
            DYAD. You must have a minimum of $1.50 deposited for each DYAD that
            you mint, but we recommend more than that.
          </Info>
          <Button
            variant="outline"
            // {/* className="p-2 border bg-gray-200" */}
            onClick={() => setDepositInput(balanceData?.formatted ?? "")}
            disabled={!selectedDnft}
          >
            MAX
          </Button>
        </div>
        <p className="text-red-500 text-xs pb-2">
          {depositAmountError
            ? depositAmountError
            : depositAmount && balanceData && depositAmount > balanceData?.value
            ? `Insufficient ${vault?.symbol} Balance`
            : ""}
        </p>
        <p className="text-green-500 text-xs">
          {collatRatio ? (
            <>
              Old CR: <span>{+formatEther(collatRatio) * 100}%</span> -&gt;
            </>
          ) : (
            ""
          )}{" "}
          {!depositAmountError &&
          depositAmount &&
          newCR &&
          minCollateralizationRatio ? (
            <span
              className={crColor(
                +formatEther(newCR),
                +formatEther(minCollateralizationRatio) * 3
              )}
            >
              New CR: {+formatEther(newCR) * 100}%
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="text-sm leading-loose text-muted-foreground">
          <p>
            0.15% frontend fee:{" "}
            {isNaN(depositInput) ? 0 : depositInput * 0.0015} ETH
          </p>
          <p>
            {crAfterDeposit && (
              <p>
                New CR: <CR cr={crAfterDeposit} />%
              </p>
            )}
          </p>
        </div>

        <Button
          className="mt-4 p-2"
          variant="default"
          disabled={
            // !selectedVault ||
            !depositAmount ||
            depositAmountError ||
            isApprovalLoading ||
            isApprovalTxLoading ||
            isDepositLoading ||
            isDepositWithFeeLoading ||
            isDepositTxLoading ||
            isDepositWithFeeTxLoading
          }
          onClick={() => {
            approvalReset();
            requiresApproval
              ? setApproval()
              : !vault?.isWrapped
              ? deposit()
              : depositWithFee();
          }}
        >
          {isApprovalLoading ||
          isApprovalTxLoading ||
          isDepositLoading ||
          isDepositWithFeeLoading ||
          isDepositWithFeeTxLoading ||
          isDepositTxLoading ? (
            <Loader />
          ) : requiresApproval ? (
            "Approve"
          ) : (
            `Deposit ${vault?.symbol ?? ""}`
          )}
        </Button>
        {/* <p className="text-red-500 text-xs pt-2"> */}
        {/*   {isApprovalError || isApprovalTxError */}
        {/*     ? "Error approving token for deposit" */}
        {/*     : isDepositError || isDepositTxError */}
        {/*     ? "Error depositing token" */}
        {/*     : ""} */}
        {/* </p> */}
      </div>

      {/* Mint Component */}
      <div className="mb-4 p-4 border">
        <div className="flex space-x-4 items-center">
          <Input
            type="text"
            placeholder="Amount to Mint"
            className="w-full p-2 border mb-2"
            value={mintInput}
            onChange={(e) => {
              setMintInput(e.target.value);
            }}
            disabled={!selectedDnft}
          />
          <Info>
            Mint DYAD stablecoins against the ETH and wETH you deposit into your
            Note. Your DYAD will be available in your connected wallet once you
            mint it. The more DYAD you mint now, the more rewards you will be
            able to claim in the near future.
          </Info>

          <Button
            variant="outline"
            onClick={() => setMintInput(maxMint.toString())}
            disabled={!selectedDnft}
          >
            MAX
          </Button>
        </div>
        {/* <p className="text-red-500 text-xs pb-2"> */}
        {/*   {mintAmountError */}
        {/*     ? mintAmountError */}
        {/*     : mintAmount && balanceData && mintAmount > maxMint */}
        {/*     ? "Not enough collateral" */}
        {/*     : ""} */}
        {/* </p> */}
        <p className="text-green-500 text-xs">
          {collatRatio ? (
            <>
              Old CR: <span>{+formatEther(collatRatio) * 100}%</span> -&gt;
            </>
          ) : (
            ""
          )}{" "}
          {mintAmount && newCR && minCollateralizationRatio ? (
            <span
              className={crColor(
                +formatEther(newCR),
                +formatEther(minCollateralizationRatio) * 3
              )}
            >
              New CR: {+formatEther(newCR) * 100}%
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="text-sm leading-loose text-muted-foreground">
          <p>
            {crAfterMint && (
              <p>
                New CR: <CR cr={crAfterMint} />%
              </p>
            )}
          </p>
        </div>
        <Button
          className="mt-4 p-2"
          variant="default"
          disabled={
            mintAmount === undefined ||
            mintAmountError !== undefined ||
            // mintAmount > maxMint ||
            isMintLoading ||
            isMintTxLoading
          }
          onClick={() => {
            if (address !== undefined) {
              mint();
            }
          }}
        >
          {isMintLoading || isMintTxLoading ? <Loader /> : "Mint DYAD"}
        </Button>
        <p className="text-red-500 text-xs pt-2">
          {isMintError || isMintTxError ? "Error minting DYAD" : ""}
        </p>
      </div>

      {/* Mint Component */}
      <div className="mb-4 p-4 border">
        <div className="flex space-x-4 items-center">
          <Input
            type="text"
            placeholder="Amount to Redeem"
            className="w-full p-2 border mb-2"
            value={redeemInput}
            onChange={(e) => setRedeemInput(e.target.value)}
            disabled={!selectedDnft}
          />
          <Info>
            Burn DYAD that you have in your connected wallet and receive the
            equivalent dollar-denominated amount of wETH. Redeeming combines the
            Burn and Withdraw functions automatically.
          </Info>
          <Button
            variant="outline"
            onClick={() =>
              setRedeemInput((dyadMinted / BigInt(10 ** 18)).toString())
            }
            disabled={!selectedDnft}
          >
            MAX
          </Button>
        </div>
        {/* <p className="text-red-500 text-xs pb-2"> */}
        {/*   {mintAmountError */}
        {/*     ? mintAmountError */}
        {/*     : mintAmount && balanceData && mintAmount > maxMint */}
        {/*     ? "Not enough collateral" */}
        {/*     : ""} */}
        {/* </p> */}
        {/* <p className="text-green-500 text-xs"> */}
        {/*   {collatRatio ? ( */}
        {/*     <> */}
        {/*       Old CR: <span>{+formatEther(collatRatio) * 100}%</span> -&gt; */}
        {/*     </> */}
        {/*   ) : ( */}
        {/*     "" */}
        {/*   )}{" "} */}
        {/*   {mintAmount && newCR && minCollateralizationRatio ? ( */}
        {/*     <span */}
        {/*       className={crColor( */}
        {/*         +formatEther(newCR), */}
        {/*         +formatEther(minCollateralizationRatio) * 3 */}
        {/*       )} */}
        {/*     > */}
        {/*       New CR: {+formatEther(newCR) * 100}% */}
        {/*     </span> */}
        {/*   ) : ( */}
        {/*     "" */}
        {/*   )} */}
        {/* </p> */}
        <Button
          className="mt-4 p-2"
          variant="default"
          disabled={
            redeemAmount === undefined ||
            // redeemAmountError !== undefined ||
            // redeemAmount > maxMint ||
            isRedeemLoading ||
            isRedeemTxLoading
          }
          onClick={() => {
            if (address !== undefined) {
              redeem();
            }
          }}
        >
          {isRedeemLoading || isRedeemTxLoading ? <Loader /> : "Redeem DYAD"}
        </Button>
        <p className="text-red-500 text-xs pt-2">
          {isRedeemError || isRedeemTxError ? "Error redeeming DYAD" : ""}
        </p>
      </div>
    </div>
  );
}
