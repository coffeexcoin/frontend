"use client";

import React from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import TabsComponent from "../reusable/TabsComponent";
import { TABS_MOCK_DATA, VAULT_CARDS_DATA } from "@/mockData/tabsMockData";
import {
  useReadDyadMintedDyad,
  useReadVaultGetUsdValue,
  useReadVaultManagerCollatRatio,
  useReadVaultManagerHasVault,
  useReadVaultManagerMinCollaterizationRatio,
  useReadWethAllowance,
  vaultAddress,
  vaultManagerAbi,
  vaultManagerAddress,
  wethAbi,
  wethAddress,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import { Button } from "../ui/button";
import { useTransactionStore } from "@/lib/store";
import NoteNumber from "./Children/NoteNumber";
import { NoteNumberDataColumnModel } from "@/models/NoteCardModels";
import { TabsDataModel } from "@/models/TabsModel";
import Deposit from "./Children/Deposit";
import Mint from "./Children/Mint";
import { useAccount } from "wagmi";
import { maxUint256 } from "viem";
import { formatNumber, fromBigNumber } from "@/lib/utils";

function NoteCard({ tokenId }: { tokenId: string }) {
  const { setTransactionData } = useTransactionStore();
  const { address } = useAccount();

  const { data: collatRatio } = useReadVaultManagerCollatRatio({
    args: [BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: mintedDyad } = useReadDyadMintedDyad({
    args: [vaultManagerAddress[defaultChain.id], BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: collateralValue } = useReadVaultGetUsdValue({
    args: [BigInt(tokenId)],
    chainId: defaultChain.id,
  });

  const { data: hasVault } = useReadVaultManagerHasVault({
    //TODO change for all vaults
    args: [BigInt(tokenId), vaultAddress[defaultChain.id]],
    chainId: defaultChain.id,
  });

  const { data: allowance } = useReadWethAllowance({
    args: [address!, vaultManagerAddress[defaultChain.id]],
    chainId: defaultChain.id,
  });

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
          collateral={formatNumber(fromBigNumber(collateralValue))}
        />
      ) : (
        <p>Deposit collateral to open vault</p>
      ),
    },
    {
      label: "Deposit and Withdraw",
      tabKey: "Deposit and Withdraw",
      content:
        allowance && allowance > 0n ? (
          <Deposit
            total_collateral={totalCollateral}
            collateralization_ratio={collatRatio}
            tokenId={tokenId}
          />
        ) : (
          <Button
            onClick={() =>
              setTransactionData({
                config: {
                  address: wethAddress[defaultChain.id],
                  abi: wethAbi,
                  functionName: "approve",
                  args: [vaultManagerAddress[defaultChain.id], maxUint256],
                },
                description: "Approve WETH for deposit",
              })
            }
          >
            Approve
          </Button>
        ),
    },
    {
      label: "Mint DYAD",
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
