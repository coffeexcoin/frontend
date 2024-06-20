import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../components/reusable/NoteCardsContainer";
import { ClaimModalContent } from "./claim-modal-content";
import { useMerklCampaign } from "@/hooks/useMerklCampaign";

export function EarnKeroseneContent() {

  const { currentCampaign: merklData } = useMerklCampaign();

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
              <div className="text-2xl text-[#FAFAFA]  ">Step 1</div>
              <div>
                Claim a Note or buy on{" "}
                <a href="https://opensea.io/collection/dyad-nft">OpenSea</a>
              </div>
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
              <div className="text-2xl text-[#FAFAFA]  ">Step 2</div>
              <div>Deposit wETH and/or wstETH and mint DYAD</div>
            </div>
            <div className="flex justify-between mt-[32px] w-full">
              <div className="w-full">
                <ButtonComponent
                  onClick={() => {
                    window.open(window.location.origin + "?tab=notes", "_self");
                  }}
                >
                  Switch to Manage Notes tab
                </ButtonComponent>
              </div>
            </div>
          </div>
        </NoteCardsContainer>
        <NoteCardsContainer>
          <div className="text-sm font-semibold text-[#A1A1AA]">
            <div className="flex w-full flex justify-between items-center">
              <div className="text-2xl text-[#FAFAFA]  ">Step 3</div>
              <div>Provide liquidity to USDC - DYAD on Uniswap v3</div>
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
                  Check your earnings on Merkl
                </ButtonComponent>
              </div>
            </div>
          </div>
        </NoteCardsContainer>
      </div>
    </div>
  );
}
