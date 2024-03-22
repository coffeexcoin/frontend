import { useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { round } from "../utils/currency";
import VaultManagerAbi from "@/abis/VaultManager.json";
import VaultAbi from "@/abis/Vault.json";
import { Abi, formatEther, getAddress, numberToHex, parseEther } from "viem";
import Loader from "./loader";
import { crColor } from "@/lib/utils";
import useCR from "@/hooks/useCR";
import CR from "./cr";
import Info from "./info.tsx";
import useEthPrice from "@/hooks/useEthPrice";

interface Props {
  setSelectedVaultId: (value: string) => void;
  vaults: {
    address: string;
    asset: string;
    symbol: string;
    collatPrice: string;
  }[];
  vaultManager: string;
  dyad: string;
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

export default function BurnAndWithdrawTab({
  setSelectedVaultId,
  selectedVault,
  vaults,
  vault,
  selectedDnft,
  totalValueLocked,
  dyadMinted,
  minCollateralizationRatio,
  vaultManager,
  dyad,
  collatRatio,
  usdValue,
  id2asset,
  selectedV,
}: Props) {
  const [oldCR, setOldCR] = useState(0);
  const [withdrawInput, setWithdrawInput] = useState<string>();
  const [burnInput, setBurnInput] = useState<string>();
  const { address } = useAccount();

  const { ethPrice } = useEthPrice();

  const { cr: crAfterBurn } = useCR(
    usdValue,
    dyadMinted,
    0,
    -1 * parseFloat(burnInput)
  );

  const { cr: crAfterWithdraw } = useCR(
    usdValue,
    dyadMinted,
    -1 * parseFloat(withdrawInput),
    0
  );

  const [withdrawAmount, withdrawAmountError] = useMemo(() => {
    if (withdrawInput === undefined || withdrawInput === "") {
      return [undefined, undefined];
    }
    try {
      return [parseEther(withdrawInput as string), undefined];
    } catch {
      return [undefined, "Invalid input"];
    }
  }, [withdrawInput]);

  const [burnAmount, burnAmountError] = useMemo(() => {
    if (burnInput === undefined || burnInput === "") {
      return [undefined, undefined];
    }
    try {
      return [parseEther(burnInput as string), undefined];
    } catch {
      return [undefined, "Invalid input"];
    }
  }, [burnInput]);

  const { data: dyadBalance } = useBalance({
    address,
    token: dyad as `0x${string}`,
  });

  const maxBurn = useMemo(() => {
    // if (parseInt(dyadBalance.value) > parseInt(id2asset)) {
    //   return id2asset;
    // } else {
    if (dyadBalance?.value === undefined) return 0;
    return dyadBalance.value / BigInt(10 ** 18);
    // }
  }, [dyadBalance, id2asset]);

  const maxWithdraw = useMemo(() => {
    const minCollateralizationRatio = "1700000000000000000";
    if (
      usdValue !== undefined &&
      minCollateralizationRatio !== undefined &&
      dyadMinted !== undefined &&
      ethPrice !== undefined
    ) {
      if (parseInt(dyadMinted) === 0) {
        return id2asset / 10 ** 18;
      }
      try {
        const a =
          BigInt(usdValue) -
          (BigInt(minCollateralizationRatio) * BigInt(dyadMinted)) /
            BigInt(10 ** 18);
        let total = 0;
        total = parseEther((parseFloat(a) / 10 ** 18 / ethPrice).toString());
        total = parseFloat(total) / 10 ** 18;
        return total;
      } catch {
        return id2asset / 10 ** 18;
      }
    } else {
      return id2asset / 10 ** 18;
    }
  }, [minCollateralizationRatio, dyadMinted, usdValue, ethPrice]);

  const { data: withdrawableBalance } = useContractReads({
    contracts: [
      {
        address: vault?.address as `0x${string}`,
        abi: VaultAbi as Abi,
        functionName: "balanceOf",
        args: [
          getAddress(numberToHex(BigInt(selectedDnft ?? "0"), { size: 20 })),
        ],
      },
      {
        address: vault?.address as `0x${string}`,
        abi: VaultAbi as Abi,
        functionName: "convertToAssets",
        args: [parseEther("1")],
      },
    ],
    select: (data) => {
      const balance = data?.[0]?.result as bigint;
      const price = data?.[1]?.result as bigint;
      if (balance === undefined || price === undefined) return undefined;
      return (balance * price) / BigInt(10 ** 18);
    },
  });

  const {
    data: withdrawTxData,
    isLoading: isWithdrawLoading,
    isError: isWithdrawError,
    write: withdraw,
    reset: withdrawReset,
  } = useContractWrite({
    address: vaultManager,
    abi: VaultManagerAbi["abi"],
    functionName: "withdraw",
    args: [
      selectedDnft ?? "0",
      vault?.address,
      withdrawAmount ?? BigInt(0),
      address,
    ],
  });

  const { isLoading: isWithdrawTxLoading, isError: isWithdrawTxError } =
    useWaitForTransaction({
      hash: withdrawTxData?.hash,
      onError: (err) => {
        console.error(err);
        withdrawReset();
      },
      onSuccess: () => {
        withdrawReset();
        setWithdrawInput("");
      },
    });

  const {
    data: burnTxData,
    isLoading: isBurnLoading,
    isError: isBurnError,
    write: burn,
    reset: burnReset,
  } = useContractWrite({
    address: vaultManager as `0x${string}`,
    abi: VaultManagerAbi["abi"],
    functionName: "burnDyad",
    args: [selectedDnft ?? "0", burnAmount ?? BigInt(0)],
  });

  const { isLoading: isBurnTxLoading, isError: isBurnTxError } =
    useWaitForTransaction({
      hash: burnTxData?.hash,
      onError: (err) => {
        console.error(err);
        burnReset();
      },
      onSuccess: () => {
        burnReset();
        setBurnInput("");
      },
    });

  const newCR = useMemo(() => {
    if (
      (dyadMinted ?? BigInt(0)) - (burnAmount ?? BigInt(0)) === BigInt(0) ||
      !collatRatio
    ) {
      return undefined;
    }
    return (
      (((totalValueLocked ?? BigInt(0)) -
        ((withdrawAmount ?? BigInt(0)) *
          BigInt(selectedVault?.collatPrice ?? parseEther("1"))) /
          parseEther("1")) *
        BigInt(10 ** 18)) /
      ((dyadMinted ?? BigInt(0)) - (burnAmount ?? BigInt(0)))
    );
  }, [
    dyadMinted,
    totalValueLocked,
    burnAmount,
    withdrawAmount,
    selectedVault,
    vault,
    collatRatio,
  ]);

  return (
    <div>
      {/* Burn Component */}
      <div className="mb-4 p-4 border">
        <div className="flex space-x-4 items-center">
          <Input
            type="text"
            placeholder="Amount to Burn"
            className="w-full p-2 border mb-2"
            value={burnInput}
            onChange={(e) => setBurnInput(e.target.value)}
            disabled={!selectedDnft}
          />
          <Info>
            Burn DYAD that you have in your connected wallet to reduce your
            Note’s DYAD minted balance. This raises your Note’s
            collateralization ratio, which makes it safer from liquidation and
            allows you to withdraw more deposited collateral.
          </Info>
          <Button
            variant="outline"
            onClick={() => setBurnInput(maxBurn.toString())}
            disabled={!selectedDnft}
          >
            MAX
          </Button>
        </div>
        <div className="text-sm leading-loose text-muted-foreground">
          <p>
            {crAfterBurn && (
              <p>
                New CR: <CR cr={crAfterBurn} />%
              </p>
            )}
          </p>
        </div>
        <Button
          className="mt-4 p-2"
          variant="default"
          disabled={
            dyadBalance?.value === undefined ||
            !burnAmount ||
            burnAmountError ||
            isBurnLoading ||
            isBurnTxLoading ||
            burnAmount > dyadBalance?.value
          }
          onClick={() => {
            if (address !== undefined) {
              burn();
            }
          }}
        >
          {isBurnLoading || isBurnTxLoading ? <Loader /> : "Burn DYAD"}
        </Button>
        <p className="text-red-500 text-xs pb-2">
          {isBurnError || isBurnTxError ? "Error burning DYAD" : ""}
        </p>
      </div>
      {/* Withdraw Component */}
      <div className="mb-4 p-4 border items-center">
        <div className="flex space-x-4 items-center">
          <Input
            type="text"
            placeholder="Amount to Withdraw"
            className="w-full p-2 border mb-2"
            value={withdrawInput}
            // disabled={!selectedVault}
            disabled={!selectedDnft}
            onChange={(e) => setWithdrawInput(e.target.value)}
          />
          <Info>
            Withdraw collateral that you have deposited into your Note. This
            will reduce your collateralization ratio. You can only withdraw down
            to the minimum 175% CR to protect your Note from liquidation.
          </Info>
          <Button
            variant="outline"
            disabled={!selectedDnft}
            onClick={() => setWithdrawInput(maxWithdraw.toString())}
          >
            MAX
          </Button>
        </div>
        <p className="text-red-500 text-xs">
          {!withdrawAmountError &&
          withdrawAmount &&
          newCR &&
          minCollateralizationRatio ? (
            <span
              className={crColor(
                +formatEther(newCR),
                +formatEther(minCollateralizationRatio) * 3
              )}
            >
              New CR:{" "}
              {newCR > BigInt(0) ? `${+formatEther(newCR) * 100}%` : "Invalid"}
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="text-sm leading-loose text-muted-foreground">
          <p>
            {crAfterWithdraw && (
              <p>
                New CR: <CR cr={crAfterWithdraw} />%
              </p>
            )}
          </p>
        </div>
        <Button
          className="mt-4 p-2"
          variant="default"
          disabled={
            // !selectedVault ||
            !withdrawAmount ||
            withdrawAmountError ||
            isWithdrawLoading ||
            isWithdrawTxLoading
          }
          onClick={() => {
            if (address !== undefined) {
              withdraw();
            }
          }}
        >
          {isWithdrawLoading || isWithdrawTxLoading ? (
            <Loader />
          ) : (
            `Withdraw ${vault?.symbol ?? ""}`
          )}
        </Button>
        <p className="text-red-500 text-xs pb-2">
          {isWithdrawError || isWithdrawTxError
            ? "Error withdrawing token"
            : ""}
        </p>
      </div>
    </div>
  );
}
