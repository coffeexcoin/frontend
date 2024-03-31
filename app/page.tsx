"use client";

import ButtonComponent from "@/components/reusable/ButtonComponent";
import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import NoteCard from "@/components/NoteCard/NoteCard";

import SortbyComponent from "@/components/reusable/SortbyComponent";
import { SORT_BY_OPTIONS } from "@/mockData/tabsMockData";
import { useState } from "react";
import { ClaimModalContent } from "@/components/claim-modal-content";
import { useQuery } from "@tanstack/react-query";
import { alchemySdk } from "@/lib/alchemy";
import { useAccount } from "wagmi";
import { dNftAddress } from "@/generated";
import { defaultChain } from "@/lib/config";
import { SnapshotClaim } from "@/components/NoteCard/Children/SnapshotClaim";
import dynamic from "next/dynamic";
import { HealthDashboard } from "@/components/NoteCard/Children/HealthDashboard";

const TabsComponent = dynamic(
  () => import("@/components/reusable/TabsComponent"),
  { ssr: false }
);

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const { address } = useAccount();
  const { data: notes } = useQuery({
    queryKey: ["notes", address],
    queryFn: () =>
      alchemySdk.nft
        .getNftsForOwner(address as string, {
          contractAddresses: [dNftAddress[defaultChain.id]],
        })
        .then((res) => res.ownedNfts.map((nft) => nft.tokenId)),
  });

  const keroseneCardsData = [
    {
      currency: "ETH - DYAD (Uniswap)",
      APY: "24",
      staked: "390",
      keroseneEarned: "830",
    },
    {
      currency: "DYAD",
      APY: "12",
      staked: "1200",
      keroseneEarned: "500",
    },
  ];
  const manageNotesContent = (
    <>
      <div className="mt-12 mb-6 flex justify-between">
        <ClaimModalContent />
        {/* <div>
          <SortbyComponent
            sortOptions={SORT_BY_OPTIONS}
            selected={selectedValue}
            onValueChange={setSelectedValue}
          />
        </div> */}
      </div>
      <div className="flex flex-col gap-4">
        {notes &&
          notes.map((tokenId) => <NoteCard key={tokenId} tokenId={tokenId} />)}
      </div>
    </>
  );

  const keroseneData = (
    <>
      <div className="mt-12">
        <ButtonComponent>Claim 1,863 Kerosene</ButtonComponent>
      </div>
      {keroseneCardsData.map((card, index) => (
        <div className="mt-6" key={index}>
          <KeroseneCard
            currency={card.currency}
            staked={card.staked}
            APY={card.APY}
            keroseneEarned={card.keroseneEarned}
          />
        </div>
      ))}
    </>
  );

  const tabsData = [
    {
      label: "Manage Notes",
      tabKey: "notes",
      content: manageNotesContent,
    },
    {
      label: "Earn Kerosene",
      tabKey: "earn-kerosene",
      content: <p>Coming Soon</p>,
    },
    {
      label: "Check Eligibility",
      tabKey: "airdrop",
      content: <SnapshotClaim />,
    },
    {
      label: "Health Dashboard",
      tabKey: "health-dashboard",
      content: <HealthDashboard />
    }
  ];

  return (
    <div className="flex-1 max-w-screen-md w-[745px] p-4 mt-4">
      <TabsComponent tabsData={tabsData} urlUpdate/>
    </div>
  );
}
