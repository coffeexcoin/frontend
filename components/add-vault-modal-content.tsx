import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { useCallback } from "react";
import VaultManagerAbi from "@/abis/VaultManager.json";
import Loader from "@/components/loader";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletButton from "@/components/ui/wallet-button";
import useModal from "@/contexts/modal";

interface Props {
  dnft: string;
  vault: string;
  vaultManager: string;
}

export function AddVaultModalContent({ dnft, vault, vaultManager }: Props) {
  const { shiftModal } = useModal();
  const { address } = useAccount();

  const {
    data: txData,
    isLoading,
    isSuccess,
    isError,
    write,
    reset,
  } = useContractWrite({
    address: vaultManager,
    abi: VaultManagerAbi["abi"],
    functionName: "add",
    args: [dnft, vault],
  });

  const { isLoading: isTxLoading, isError: isTxError } = useWaitForTransaction({
    hash: txData?.hash,
    onError: console.error,
  });

  const addVault = useCallback(() => {
    if (isSuccess && !isTxLoading) {
      close();
    } else {
      write({
        args: [dnft, vault?.address],
      });
    }
  }, [vaultManager, write, dnft]);

  const close = useCallback(() => {
    reset();
    shiftModal();
  }, [reset, shiftModal]);

  return (
    <div className="w-80">
      <CardTitle className="text-md">
        {isError
          ? "Error"
          : isSuccess && !isTxLoading
          ? "Success!"
          : `Enable ${vault?.symbol} Deposit`}
      </CardTitle>
      <CardContent className="px-0 py-2 test-sm">
        {isError
          ? "Error sending transaction, please try again"
          : isSuccess && !isTxLoading
          ? `${vault?.symbol} depositing enabled successfully!`
          : `You must enable ${vault?.symbol} for your Note before you can deposit.`}
      </CardContent>
      {address ? (
        <Button className="mt-2 w-full" onClick={addVault}>
          {isError || isTxError ? (
            "Retry"
          ) : isSuccess && !isTxLoading ? (
            "Close"
          ) : isLoading || isTxLoading ? (
            <Loader />
          ) : (
            `Enable ${vault?.symbol}`
          )}
        </Button>
      ) : (
        <WalletButton className="mt-2 w-full" />
      )}
    </div>
  );
}
