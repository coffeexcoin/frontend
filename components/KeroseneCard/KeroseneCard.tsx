import {useState} from "react";
import {useWriteContract, useReadContract, useAccount} from "wagmi";
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

const KeroseneCard: React.FC<KeroseneProps> = ({
  currency,
  APY,
  staked,
  keroseneEarned,
}) => {
  const {address} = useAccount();
  const [stakeInputValue, setStakeInputValue] = useState("");
  const [unstakeInputValue, setUnstakeInputValue] = useState("");

  const onMaxStakeHandler = () => {
    setStakeInputValue("9999999");
  };

  const onMaxUnstakeHandler = () => {
    setUnstakeInputValue("9999999");
  };

  const stakeHandler = () => console.log("Staked");
  const unstakeHandler = () => console.log("Unstaked");

  const STAKING_CONTRACT =  "0x8e0e695fEC31d5502C2f3E860Fe560Ea80b03E1D"

  console.log("staking", StakingAbi.abi);

  const amountStaked = useReadContract({
    address: STAKING_CONTRACT,
    abi: StakingAbi.abi,
    functionName: "balanceOf",
    args: [address],
  })

  const earned = useReadContract({
    address: STAKING_CONTRACT,
    abi: StakingAbi.abi,
    functionName: "earned",
    args: [address],
  })

  const {writeContract: writeStake} = useWriteContract()
  const {writeContract: writeUnstake} = useWriteContract()

  return (
    <NoteCardsContainer>
      <div className="text-sm font-semibold text-[#A1A1AA]">
        <div className="text-2xl text-[#FAFAFA] flex justify-between mt-[15px] w-full">
          <div>{currency}</div>
          {/* <div>{APY}% APY</div> */}
        </div>
        <div className="flex justify-between mt-[32px] w-full">
          <div className="w-[380px] ">
            <InputComponent
              placeHolder={`Amount of ${currency} to stake`}
              onValueChange={setStakeInputValue}
              value={stakeInputValue}
              type="number"
              max={9999999}
            />
          </div>
          <div className="w-[74px]">
            {/* <ButtonComponent variant="bordered" onClick={onMaxStakeHandler}> */}
            {/*   Max */}
            {/* </ButtonComponent> */}
          </div>
          <div className="w-[128px]">
            <ButtonComponent onClick={() => writeStake(
              {
                address: STAKING_CONTRACT,
                abi: StakingAbi.abi,
                functionName: "stake",
                args: [stakeInputValue],
              }
            )}>Stake</ButtonComponent>
          </div>
        </div>
        <div className="flex justify-between mt-[32px]">
          <div className="flex">
            <div className="mr-[5px]">
              <strong>{currency}</strong>
              {` Staked:`}
            </div>
            <div>{amountStaked.data || 0}</div>
          </div>
          <div className="flex">
            <div className="mr-[5px]">Kerosene earned:</div>
            <div>{earned.data || 0}</div>
          </div>
        </div>
        <div className="flex justify-between mt-[32px] w-full">
          <div className="w-[380px] ">
            <InputComponent
              placeHolder={`Amount of ${currency} to unstake`}
              onValueChange={setUnstakeInputValue}
              value={unstakeInputValue}
              type="number"
              max={9999999}
            />
          </div>
          {/* <div className="w-[74px]"> */}
          {/*   <ButtonComponent variant="bordered" onClick={onMaxUnstakeHandler}> */}
          {/*     Max */}
          {/*   </ButtonComponent> */}
          {/* </div> */}
          <div className="w-[128px]">
            <ButtonComponent onClick={() => writeStake(
              {
                address: STAKING_CONTRACT,
                abi: StakingAbi.abi,
                functionName: "withdraw",
                args: [stakeInputValue],
              }
            )}>Unstake</ButtonComponent>
          </div>
        </div>
      </div>
    </NoteCardsContainer>
  );
};
export default KeroseneCard;
