import {
  useAccount,
  useContractRead,
  useContractReads,
  useNetwork,
} from "wagmi";
import { Abi, getAddress, numberToHex } from "viem";
import { useMemo, useState } from "react";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Button } from "@/components/ui/button";
import MintAndDepositTab from "@/components/mint-and-deposit-tab";
import BurnAndWithdrawTab from "@/components/burn-and-withdraw-tab";
import { MAX_UINT256, deployments } from "@/lib/deployments";
import VaultManagerAbi from "@/abis/VaultManager.json";
import VaultAbi from "@/abis/Vault.json";
import DyadAbi from "@/abis/Dyad.json";
import DNftAbi from "@/abis/DNft.json";
import useModal from "@/contexts/modal";
import { AddVaultModalContent } from "./add-vault-modal-content";
import { ClaimModalContent } from "./claim-modal-content";
import { round } from "../utils/currency";

export default function DnftBox() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const [selectedDnft, setSelectedDnft] = useState<string>();
  const [cr, setCr] = useState<string>();
  const [mintedDyad, setMintedDyad] = useState<string>();
  const [usdValue, setUsdValue] = useState<string>();
  const [selectedVault, setSelectedVault] = useState();
  const { pushModal } = useModal();

  const { vaultManager, dyad, dnft, weth, payments, vaults } = useMemo(
    () =>
      chain && deployments[chain.id]
        ? deployments[chain.id]
        : Object.values(deployments)[0],
    [chain]
  );

  const { data: initialContractReads } = useContractReads({
    contracts: [
      {
        address: dnft as `0x${string}`,
        abi: DNftAbi as Abi,
        functionName: "balanceOf",
        args: [address ?? "0"],
      },
      {
        address: vaultManager as `0x${string}`,
        abi: VaultManagerAbi as Abi,
        functionName: "collatRatio",
        args: [selectedDnft ?? "0"],
      },
      {
        address: vaultManager as `0x${string}`,
        abi: VaultManagerAbi as Abi,
        functionName: "getVaultsUsdValue",
        args: [selectedDnft ?? "0"],
      },
      {
        address: dyad as `0x${string}`,
        abi: DyadAbi["abi"],
        functionName: "mintedDyad",
        args: [vaultManager, selectedDnft ?? "0"],
      },
      {
        address: vaultManager as `0x${string}`,
        abi: VaultManagerAbi as Abi,
        functionName: "MIN_COLLATERIZATION_RATIO",
      },
      {
        address: vaultManager,
        abi: VaultManagerAbi["abi"],
        functionName: "collatRatio",
        args: [selectedDnft ?? "0"],
      },
      {
        address: vaultManager,
        abi: VaultManagerAbi["abi"],
        functionName: "getTotalValue",
        args: [selectedDnft ?? "0"],
      },
      {
        address: selectedVault?.address ?? vaults[0]?.address,
        abi: VaultAbi["abi"],
        functionName: "id2asset",
        args: [selectedDnft ?? "0"],
      },
    ],
    watch: true,
    onSuccess: (data) => {
      setMintedDyad(data?.dyadMinted?.toString());
      setCr(
        data?.collatRatio?.toString() === MAX_UINT256
          ? "0"
          : data?.collatRatio?.toString()
      );
      setUsdValue(data?.usdValue?.toString());
    },
    select: (data) => ({
      dnftBalance: +(data?.[0]?.result?.toString() ?? "0"),
      collateralRatio: (data?.[1]?.result ?? BigInt(0)) as bigint,
      totalValueLocked: (data?.[2]?.result ?? BigInt(0)) as bigint,
      dyadMinted: (data?.[3]?.result ?? BigInt(0)) as bigint,
      minCollateralizationRatio: (data?.[4]?.result ?? BigInt(0)) as bigint,
      collatRatio: (data?.[5]?.result ?? BigInt(0)) as bigint,
      usdValue: (data?.[6]?.result ?? BigInt(0)) as bigint,
      id2asset: data?.[7]?.result?.toString(),
    }),
  });

  const {
    dnftBalance,
    collateralRatio,
    totalValueLocked,
    dyadMinted,
    minCollateralizationRatio,
    id2asset,
  } = initialContractReads ?? {};

  // Get addresses of all dnfts owned by user
  const { data: dnfts } = useContractReads({
    contracts: Array.apply(null, Array(dnftBalance ?? 0)).map((_, index) => ({
      address: dnft as `0x${string}`,
      abi: DNftAbi as Abi,
      functionName: "tokenOfOwnerByIndex",
      args: [address ?? "0", index],
    })),
    watch: true,
    select: (data) =>
      data
        .map((dnft) => (dnft?.result ?? -1).toString())
        .filter((id) => id !== "-1"),
  });

  // Prompt user to add vault if they haven't already
  useContractRead({
    enabled: selectedDnft !== undefined && selectedVault !== undefined,
    address: vaultManager,
    abi: VaultManagerAbi["abi"],
    functionName: "hasVault",
    args: [selectedDnft, selectedVault?.address],
    onSuccess: (result) => {
      if (result !== undefined && !result) {
        pushModal(
          <AddVaultModalContent
            dnft={selectedDnft}
            vault={selectedVault}
            vaultManager={vaultManager}
          />
        );
      }
    },
  });

  return (
    <div className="pt-1">
      {(!isConnected || dnfts?.length === 0) && (
        <div className="text-sm leading-loose text-muted-foreground py-2">
          To start, claim your first Note. Notes are ERC-721 NFTs that track
          your collateral and DYAD minted balance.
        </div>
      )}
      <div className="w-full mb-4">
        <Button
          onClick={() => {
            pushModal(<ClaimModalContent />);
          }}
        >
          {dnfts?.length === 0 ? "Claim Note" : "Claim additional Note"}
        </Button>
      </div>
      {isConnected && dnfts?.length > 0 && (
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center space-x-10">
            <Select onValueChange={setSelectedDnft}>
              <SelectTrigger id="select-dnft" className="mt-1">
                <SelectValue placeholder="Select Note" />
              </SelectTrigger>
              <SelectContent>
                {dnfts?.map((dnft) => (
                  <SelectItem value={dnft} key={`dnft-${dnft}`}>
                    Note {dnft}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDnft !== undefined && (
              <div className="flex space-x-4">
                <div className="flex space-x-1">
                  <div>CR:</div>
                  <div>{round(cr / 10 ** 16, 0)}%</div>
                </div>
                <div className="flex space-x-1">
                  <div className="flex space-x-1">
                    <div>{round(mintedDyad / 10 ** 18, 2)}</div>
                    <div>DYAD</div>
                  </div>
                  <div>/</div>
                  <div className="flex ">
                    <div>$</div>
                    <div>{round(usdValue / 10 ** 18, 2)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {selectedDnft && (
            <div className="w-[33.5rem]">
              <Select onValueChange={setSelectedVault}>
                <SelectTrigger id="select-dnft" className="mt-1">
                  <SelectValue placeholder="Select Collateral" />
                </SelectTrigger>
                <SelectContent>
                  {vaults?.map((vault) => (
                    <SelectItem value={vault} key={`collat-${vault.address}`}>
                      {vault.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
      {
        <div className="pt-4">
          <MintAndDepositTab
            vault={selectedVault}
            payments={payments}
            weth={weth}
            vaultManager={vaultManager}
            selectedDnft={selectedDnft}
            dyadMinted={dyadMinted}
            totalValueLocked={totalValueLocked}
            minCollateralizationRatio={minCollateralizationRatio}
            usdValue={usdValue}
            selectedVaultAddress={selectedVault?.address}
            selectedV={selectedVault}
          />
          <BurnAndWithdrawTab
            vault={selectedVault}
            vaultManager={vaultManager}
            selectedDnft={selectedDnft}
            dyadMinted={dyadMinted}
            totalValueLocked={totalValueLocked}
            minCollateralizationRatio={minCollateralizationRatio}
            dyad={dyad}
            collatRatio={collateralRatio}
            usdValue={usdValue}
            selectedV={selectedVault}
            id2asset={id2asset}
          />
        </div>
      }
    </div>
  );
}
