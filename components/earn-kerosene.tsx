import {useAccount} from "wagmi";
import {formatEther, parseEther} from "viem";
import {Button} from "@/components/ui/button";
import {
  dNftAbi,
  dNftAddress,
  useReadDNftPriceIncrease,
  useReadDNftPublicMints,
  useReadDNftStartPrice,
  useReadDNftTotalSupply,
} from "@/generated";
import {defaultChain} from "@/lib/config";
import {useTransactionStore} from "@/lib/store";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import KeroseneCardMerkle from "@/components/KeroseneCard/KeroseneCardMerkle";
import StakingAbi from "@/abis/Staking.json";
import useKerosenePrice from "@/hooks/useKerosenePrice";
import NoteCardsContainer from "../components/reusable/NoteCardsContainer";
import {ClaimModalContent} from "./claim-modal-content";
import {useEffect, useState} from "react";

type MerklData = {
  apr: number;
  tvl: number;
};

export function EarnKeroseneContent() {
  const [merklData, setMerkleData] = useState<MerklData | undefined>(undefined);
  const {address, isConnected} = useAccount();
  const {setTransactionData} = useTransactionStore();
  console.log("staking", StakingAbi.abi);

  const {data: startingPrice} = useReadDNftStartPrice({
    chainId: defaultChain.id,
  });
  console.log("READING", startingPrice);
  const {data: publicMints} = useReadDNftPublicMints({
    chainId: defaultChain.id,
  });
  const {data: priceIncrease} = useReadDNftPriceIncrease({
    chainId: defaultChain.id,
  });
  const {data: totalSupply} = useReadDNftTotalSupply({
    chainId: defaultChain.id,
  });

  const mintPrice = formatEther(
    (startingPrice || 0n) + (priceIncrease || 0n) * (publicMints || 0n)
  );

  const nextNote = parseInt(totalSupply?.toString() || "0", 10);

  const {kerosenePrice} = useKerosenePrice();

  const keroseneCardsData = [
    {
      currency: "ETH - DYAD (Uniswap)",
      APY: "24",
      staked: "390",
      keroseneEarned: "830",
    },
  ];

  useEffect(() => {
    async function getMerkl() {

      const res = await fetch("https://api.merkl.xyz/v3/campaigns?chainIds=1");
      const data = await res.json();
      const campaign = data["1"]["2_0x8B238f615c1f312D22A65762bCf601a37f1EeEC7"]["0x4f8ccee1c8ce51b094d1f0fc4ac5f02d34c36c659ba62cffb05c86fd727d0350"]
      console.log("xxxxx", campaign);
      setMerkleData(campaign)
    }
    getMerkl();
  }, [])


  if (isConnected) {
    return (
      <div>
        {merklData && (
          <div className="flex justify-between text-2xl p-[2rem] pl-[5rem] pr-[5rem] font-bold">
            <div>{merklData.apr.toFixed(0)}% APR</div>
            <div>${merklData.tvl.toLocaleString()} TVL</div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <NoteCardsContainer>
            <div className="text-sm font-semibold text-[#A1A1AA]">
              <div className="flex w-full flex justify-between items-center">

                <div className="text-2xl text-[#FAFAFA]  ">
                  Step 1
                </div>
                <div >Claim a Note or buy on OpenSea</div>
              </div>
              <div className="flex justify-between mt-[32px] w-full">
                <div className="w-full">
                  <ClaimModalContent />
                </div>
              </div>
            </div>
          </NoteCardsContainer>
          <NoteCardsContainer>
            <div className="text-sm font-semibold text-[#A1A1AA]">
              <div className="flex w-full flex justify-between items-center">

                <div className="text-2xl text-[#FAFAFA]  ">
                  Step 2
                </div>
                <div >Deposit wETH and/or wstETH and mint DYAD</div>
              </div>
              <div className="flex justify-between mt-[32px] w-full">
                <div className="w-full">
                  <ButtonComponent>
                    Switch to Manage Notes tab
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </NoteCardsContainer>
          <NoteCardsContainer>
            <div className="text-sm font-semibold text-[#A1A1AA]">
              <div className="flex w-full flex justify-between items-center">

                <div className="text-2xl text-[#FAFAFA]  ">
                  Step 3
                </div>
                <div >Provide liquidity to USDC - DYAD on Uniswap v3</div>
              </div>
              <div className="flex justify-between mt-[32px] w-full">
                <div className="w-full">
                  <ButtonComponent
                    onClick={() =>
                      window.open(
                        "https://app.uniswap.org/add/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xFd03723a9A3AbE0562451496a9a394D2C4bad4ab/500?minPrice=1.003256&maxPrice=1.005265"
                      )
                    }
                  >
                    LP USDC - DYAD on Uniswap V3
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </NoteCardsContainer>
          <NoteCardsContainer>
            <div className="text-sm font-semibold text-[#A1A1AA]">
              <div className="flex w-full flex justify-between items-center">

                <div className="text-2xl text-[#FAFAFA]  ">
                  That's it. No staking necessary.
                </div>
              </div>
              <div className="flex justify-between mt-[32px] w-full">
                <div className="w-full">
                  <ButtonComponent
                    onClick={() =>
                      window.open(
                        "https://merkl.angle.money/ethereum/pool/0x8B238f615c1f312D22A65762bCf601a37f1EeEC7"
                      )
                    }
                  >
                    Stake and Earn on Merkle
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </NoteCardsContainer>
        </div>
      </div>
    );
  }

  return <p>Connect wallet to view notes</p>;
}
