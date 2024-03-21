import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  dNftAbi,
  dNftAddress,
  useReadDNftPriceIncrease,
  useReadDNftPublicMints,
  useReadDNftStartPrice,
  useReadDNftTotalSupply,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import { useTransactionStore } from "@/lib/store";

export function ClaimModalContent() {
  const { address, isConnected } = useAccount();
  const { setTransactionData } = useTransactionStore();

  const { data: startingPrice } = useReadDNftStartPrice({
    chainId: defaultChain.id,
  });
  const { data: publicMints } = useReadDNftPublicMints({
    chainId: defaultChain.id,
  });
  const { data: priceIncrease } = useReadDNftPriceIncrease({
    chainId: defaultChain.id,
  });
  const { data: totalSupply } = useReadDNftTotalSupply({
    chainId: defaultChain.id,
  });

  const mintPrice = formatEther(
    (startingPrice || 0n) + (priceIncrease || 0n) * (publicMints || 0n)
  );

  const nextNote = parseInt(totalSupply?.toString() || "0", 10);

  if (isConnected) {
    return (
      <Button
        onClick={() => {
          setTransactionData({
            config: {
              address: dNftAddress[defaultChain.id],
              abi: dNftAbi,
              functionName: "mintNft",
              args: [address],
              value: parseEther(mintPrice),
            },
            description: `Mint Note Nº ${nextNote} for ${mintPrice} ETH`,
          });
        }}
      >
        Mint Note Nº {nextNote} for {mintPrice} ETH
      </Button>
    );
  }

  return <p>Connect wallet to view notes</p>
}
