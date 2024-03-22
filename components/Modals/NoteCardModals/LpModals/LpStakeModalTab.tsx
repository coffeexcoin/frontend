import ButtonComponent from "@/components/reusable/ButtonComponent";
import InputComponent from "@/components/reusable/InputComponent";
import useModal from "@/contexts/modal";
import React, { useState } from "react";

interface LpStakeModalTabProps {
  pool: string;
  currentMomentum: string;
  NewMomentum: string;
  type?: "stake" | "unstake";
}

const LpStakeModalTab: React.FC<LpStakeModalTabProps> = ({
  pool,
  currentMomentum,
  NewMomentum,
  type = "stake",
}) => {
  const { shiftModal } = useModal();

  const [inputValue, setInputValue] = useState("");

  const onClickHandler = () => {
    setInputValue("9999999");
  };

  const submitHandler = () => {
    console.log("Staked");
  };

  const cancelHandler = () => {
    shiftModal();
  };
  return (
    <div>
      <div className="flex justify-between w-full mt-[35px]">
        <div className="w-5/6 ">
          <InputComponent
            placeHolder={`Amount of ${pool} to ${type}`}
            onValueChange={setInputValue}
            value={inputValue}
            type="number"
            max={9999999}
          />
        </div>
        <div className="w-[74px]">
          <ButtonComponent onClick={onClickHandler} variant="bordered">
            Max
          </ButtonComponent>
        </div>
      </div>
      <div className="flex w-full mt-[35px] justify-between px-[10px] font-semibold text-sm">
        <div className="flex text-[#A1A1AA]">
          <div className="mr-[5px]">Current Momentum:</div>
          <div>{currentMomentum}</div>
        </div>
        <div className="flex">
          <div className="mr-[5px] ">New momentum:</div>
          <div>{NewMomentum}</div>
        </div>
      </div>
      <div className="flex justify-between mt-[35px] ">
        <div className="w-[280px]">
          <ButtonComponent onClick={submitHandler} variant="solid">
            {`${type === "stake" ? "Stake" : "Unstake"} ${pool}`}
          </ButtonComponent>
        </div>
        <div className="w-[280px] ">
          <ButtonComponent onClick={cancelHandler} variant="bordered">
            Cancel
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};
export default LpStakeModalTab;
