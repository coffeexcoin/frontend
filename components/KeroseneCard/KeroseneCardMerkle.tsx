import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import InputComponent from "@/components/reusable/InputComponent";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import StakingAbi from "@/abis/Staking.json";

interface KeroseneProps {
  currency: string;
  APY: string;
  staked: string;
  keroseneEarned: string;
}

const KeroseneCardMerkle: React.FC<KeroseneProps> = ({
  currency,
  APY,
  staked,
  keroseneEarned,
  kerosenePrice,
}) => {
  const { address } = useAccount();
  const [stakeInputValue, setStakeInputValue] = useState("");
  const [unstakeInputValue, setUnstakeInputValue] = useState("");

  const onMaxStakeHandler = () => {
    setStakeInputValue("9999999");
  };

  const onMaxUnstakeHandler = () => {
    setUnstakeInputValue("9999999");
  };

  // REFACTOR THIS!
  const STAKING_CONTRACT = "0x8e0e695fEC31d5502C2f3E860Fe560Ea80b03E1D";

  console.log("staking", StakingAbi.abi);

  const amountStaked = useReadContract({
    address: STAKING_CONTRACT,
    abi: StakingAbi.abi,
    functionName: "balanceOf",
    args: [address],
  });

  const earned = useReadContract({
    address: STAKING_CONTRACT,
    abi: StakingAbi.abi,
    functionName: "earned",
    args: [address],
  });

  const { writeContract: writeStake } = useWriteContract();
  const { writeContract: writeUnstake } = useWriteContract();

  return (
    <NoteCardsContainer>
      <div className="text-sm font-semibold text-[#A1A1AA]">
        <div className="text-2xl text-[#FAFAFA] flex justify-between mt-[15px] w-full">
          <div>{currency}</div>
          {/* <div>${kerosenePrice}</div> */}
        </div>
        <div className="flex justify-between mt-[32px] w-full">
          {/* <div className="w-[74px]"> */}
          {/*   <ButtonComponent variant="bordered" onClick={onMaxUnstakeHandler}> */}
          {/*     Max */}
          {/*   </ButtonComponent> */}
          {/* </div> */}
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
  );
};
export default KeroseneCardMerkle;
