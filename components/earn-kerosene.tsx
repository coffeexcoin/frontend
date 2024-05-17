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
import StakingAbi from "@/abis/Staking.json";
import useKerosenePrice from "@/hooks/useKerosenePrice";

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
              kerosenePrice={kerosenePrice}
            />
          </div>
        ))}
      </>
    );
  }

  return <p>Connect wallet to view notes</p>;
}
