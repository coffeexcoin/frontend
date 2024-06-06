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

export function EarnKeroseneContent() {
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

  if (isConnected) {
    return (
      <>
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
      </>
    );
  }

  return <p>Connect wallet to view notes</p>;
}
