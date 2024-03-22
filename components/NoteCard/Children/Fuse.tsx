import ButtonComponent from "@/components/reusable/ButtonComponent";
import InputComponent from "@/components/reusable/InputComponent";
import React, { useState } from "react";

interface FuseProps {
  fusedKerosene: string;
  currentCr: string;
  newCr: string;
}

const Fuse: React.FC<FuseProps> = ({ fusedKerosene, currentCr, newCr }) => {
  const [inputValue, setInputValue] = useState("");

  const onMaxHandler = () => {
    setInputValue("9999999");
  };

  const submitHandler = () => console.log("Fused");

  return (
    <div className="text-sm font-semibold text-[#A1A1AA]">
      <div className="flex justify-between mt-[60px] w-full">
        <div className="w-[380px] ">
          <InputComponent
            placeHolder={`Amount of Kerosene to Fuse`}
            onValueChange={setInputValue}
            value={inputValue}
            type="number"
            max={9999999}
          />
        </div>
        <div className="w-[74px]">
          <ButtonComponent variant="bordered" onClick={onMaxHandler}>
            Max
          </ButtonComponent>
        </div>
        <div className="w-[128px]">
          <ButtonComponent onClick={submitHandler}>Fuse</ButtonComponent>
        </div>
      </div>
      <div className="flex justify-between mt-[63px]">
        <div className="flex">
          <div className="mr-[5px]">APY:</div>
          <div>{fusedKerosene}</div>
        </div>
        <div className="flex">
          <div className="mr-[5px]">Current CR:</div>
          <div>{currentCr}</div>
        </div>
        <div className="flex">
          <div className="mr-[5px]">New CR:</div>
          <div>{newCr}</div>
        </div>
      </div>
    </div>
  );
};
export default Fuse;
