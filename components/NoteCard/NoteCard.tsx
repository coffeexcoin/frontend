"use client";

import React from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import TabsComponent from "../reusable/TabsComponent";
import {
  useReadDyadMintedDyad,
  useReadVaultManagerCollatRatio,
  useReadVaultManagerGetTotalUsdValue,
  useReadVaultManagerMinCollaterizationRatio,
  vaultManagerAbi,
  vaultManagerAddress,
  wEthVaultAbi,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import NoteNumber from "./Children/NoteNumber";
import { NoteNumberDataColumnModel } from "@/models/NoteCardModels";
import { TabsDataModel } from "@/models/TabsModel";
import Deposit, { supportedVaults } from "./Children/Deposit";
import Mint from "./Children/Mint";
import { useReadContract, useReadContracts } from "wagmi";
import { maxUint256 } from "viem";
import { formatNumber, fromBigNumber } from "@/lib/utils";
import { vaultInfo } from "@/lib/constants";

function NoteCard({ tokenId }: { tokenId: string }) {
  const { data: collatRatio } = useReadVaultManagerCollatRatio({
    args: [BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: mintedDyad } = useReadDyadMintedDyad({
    args: [vaultManagerAddress[defaultChain.id], BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: collateralValue } = useReadVaultManagerGetTotalUsdValue({
    args: [BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: hasVaultData } = useReadContracts({
    contracts: supportedVaults.map((address) => ({
      address: vaultManagerAddress[defaultChain.id],
      abi: vaultManagerAbi,
      functionName: "hasVault",
      args: [BigInt(tokenId), address],
      chainId: defaultChain.id,
    })),
    allowFailure: false,
  });
  const hasVault = (hasVaultData?.filter((data) => !!data)?.length || 0) > 0;

  const { data: vaultCollateral } = useReadContracts({
    contracts: supportedVaults.map((address) => ({
      address: address,
      abi: wEthVaultAbi,
      functionName: "getUsdValue",
      args: [BigInt(tokenId)],
      chainId: defaultChain.id,
    })),
    allowFailure: false,
  });

  const vaultUsd = vaultCollateral?.map((value, i) => ({
    value: fromBigNumber(value),
    label: vaultInfo[i].symbol,
  })).filter((data) => !!data.value);

  const { data: minCollateralizationRatio } =
    useReadVaultManagerMinCollaterizationRatio({ chainId: defaultChain.id });

  const totalCollateral = `$${formatNumber(fromBigNumber(collateralValue))}`;
  const collateralizationRatio =
    collatRatio === maxUint256
      ? "Infinity"
      : `${formatNumber(fromBigNumber(collatRatio, 16))}%`;
  const totalDyad = `${fromBigNumber(mintedDyad)}`;

  const maxDyad = (collateralValue || 0n) / (minCollateralizationRatio || 1n);

  const noteData: NoteNumberDataColumnModel[] = [
    {
      text: "Collateralization ratio",
      value: collateralizationRatio,
      highlighted: true,
    },
    {
      text: "DYAD minted",
      value: totalDyad,
      highlighted: false,
    },
    {
      text: "Collateral",
      value: totalCollateral,
      highlighted: false,
    },
  ];

  const tabData: TabsDataModel[] = [
    {
      label: `Note Nº ${tokenId}`,
      tabKey: `Note Nº ${tokenId}`,
      content: hasVault ? (
        <NoteNumber
          data={noteData}
          dyad={[
            parseFloat(maxDyad.toString()) - fromBigNumber(mintedDyad),
            fromBigNumber(mintedDyad),
          ]}
          collateral={vaultUsd as any}
        />
      ) : (
        <p>Deposit collateral to open vault</p>
      ),
    },
    {
      label: "Deposit & Withdraw",
      tabKey: "Deposit and Withdraw",
      content: (
        <Deposit
          total_collateral={totalCollateral}
          collateralization_ratio={collatRatio}
          tokenId={tokenId}
        />
      ),
    },
    {
      label: "Mint & Burn",
      tabKey: "Mint DYAD",
      content: (
        <Mint
          dyadMinted={totalDyad}
          currentCr={collatRatio}
          tokenId={tokenId}
        />
      ),
    },
  ];

  return (
    <NoteCardsContainer>
      <TabsComponent tabsData={tabData} />
    </NoteCardsContainer>
  );
}

export default NoteCard;
