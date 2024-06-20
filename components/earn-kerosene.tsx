import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../components/reusable/NoteCardsContainer";
import { ClaimModalContent } from "./claim-modal-content";
import { useMerklCampaign } from "@/hooks/useMerklCampaign";
import { useAccount } from "wagmi";
import { useMerklRewards } from "@/hooks/useMerklRewards";
import { formatEther } from "viem";
import {
  keroseneAddress,
  useSimulateDistributorClaim,
  useWriteDistributorClaim,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import useKerosenePrice from "@/hooks/useKerosenePrice";
import { useMemo } from "react";

export function EarnKeroseneContent() {
  const { address } = useAccount();

  const { currentCampaign: merklData } = useMerklCampaign();
  const { merklRewards, error, loading, refetch } = useMerklRewards({
    address,
  });

  const { data: claimMerklRewardsConfig } = useSimulateDistributorClaim({
    args: [
      [address!],
      [keroseneAddress[defaultChain.id]],
      [merklRewards?.accumulated || 0n],
      [merklRewards?.proof || []],
    ],
    query: {
      enabled:
        address !== undefined &&
        merklRewards !== undefined &&
        merklRewards.accumulated > 0n,
    },
  });

  const { kerosenePrice } = useKerosenePrice();

  const { totalUsd, claimableUsd } = useMemo(() => {
    if (merklRewards === undefined || kerosenePrice === undefined) {
      return { totalUsd: 0, claimableUsd: 0 };
    }

    let totalUsd =
      Number(formatEther(merklRewards.accumulated || 0n)) * kerosenePrice;
    totalUsd = Number(totalUsd.toFixed(2));

    let claimableUsd =
      Number(formatEther(merklRewards.unclaimed || 0n)) * kerosenePrice;
    claimableUsd = Number(claimableUsd.toFixed(2));

    return {
      totalUsd: totalUsd.toLocaleString(),
      claimableUsd: claimableUsd.toLocaleString(),
    };
  }, [merklRewards, kerosenePrice]);

  const { writeContract: claimMerklRewards, error: claimError } =
    useWriteDistributorClaim();

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
                Step 4: Claim Rewards
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-between mt-[32px] w-full">
              {address === undefined ? (
                <>
                  <p>Connect Wallet to see rewards or</p>
                  <ButtonComponent
                    onClick={() =>
                      window.open(
                        "https://merkl.angle.money/user/"
                      )
                    }
                  >
                    Check your earnings on Merkl
                  </ButtonComponent>
                </>
              ) : (
                <>
                  <div className="w-full grid grid-cols-3">
                    {loading ? (
                      <p>Loading...</p>
                    ) : error ? (
                      <p className="grid-span-3">{error}</p>
                    ) : (
                      <>
                        <p>Your total earnings</p>
                        <p>
                          {Number(
                            formatEther(merklRewards?.accumulated || 0n)
                          ).toLocaleString()}{" "}
                          KEROSENE
                        </p>
                        <p>{totalUsd && `$${totalUsd}`}</p>
                        <p>Total claimable</p>
                        <p>
                          {Number(
                            formatEther(merklRewards?.unclaimed || 0n)
                          ).toLocaleString()}{" "}
                          KEROSENE
                        </p>
                        <p>{claimableUsd && `$${claimableUsd}`}</p>
                      </>
                    )}
                  </div>
                  {merklRewards &&
                    merklRewards.unclaimed > 0n &&
                    claimMerklRewardsConfig != undefined &&
                    claimError === null && (
                      <div className="w-full">
                        <ButtonComponent
                          onClick={() => {
                            claimMerklRewards(claimMerklRewardsConfig.request);
                          }}
                        >
                          Claim
                        </ButtonComponent>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </NoteCardsContainer>
      </div>
    </div>
  );
}
