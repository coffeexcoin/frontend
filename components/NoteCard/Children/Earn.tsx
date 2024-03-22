import ButtonComponent from "@/components/reusable/ButtonComponent";
import InputComponent from "@/components/reusable/InputComponent";
import React, { useState } from "react";

interface EarnProps {
  apy: string;
  currentCr: string;
  newCr: string;
}

const Earn: React.FC<EarnProps> = ({ apy, currentCr, newCr }) => {
  const [mintInputValue, setMintInputValue] = useState("");
  const [burnInputValue, setBurnInputValue] = useState("");

  const onMaxMintHandler = () => {
    setMintInputValue("9999999");
  };

  const onMaxBurnHandler = () => {
    setBurnInputValue("9999999");
  };

  const mintHandler = () => console.log("Minted");
  const burntHandler = () => console.log("Burned");

  return (
    <div className="text-sm font-semibold text-[#A1A1AA]">
      <div className="flex justify-between mt-[32px] w-full">
        <div className="w-[380px] ">
          <InputComponent
            placeHolder={`Amount of DYAD to mint`}
            onValueChange={setMintInputValue}
            value={mintInputValue}
            type="number"
            max={9999999}
          />
        </div>
        <div className="w-[74px]">
          <ButtonComponent variant="bordered" onClick={onMaxMintHandler}>
            Max
          </ButtonComponent>
        </div>
        <div className="w-[128px]">
          <ButtonComponent onClick={mintHandler}>Mint</ButtonComponent>
        </div>
      </div>
      <div className="flex justify-between mt-[32px]">
        <div className="flex">
          <div className="mr-[5px]">APY:</div>
          <div>{apy}</div>
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
      <div className="flex justify-between mt-[32px] w-full">
        <div className="w-[380px] ">
          <InputComponent
            placeHolder={`Amount of DYAD to burn`}
            onValueChange={setBurnInputValue}
            value={burnInputValue}
            type="number"
            max={9999999}
          />
        </div>
        <div className="w-[74px]">
          <ButtonComponent variant="bordered" onClick={onMaxBurnHandler}>
            Max
          </ButtonComponent>
        </div>
        <div className="w-[128px]">
          <ButtonComponent onClick={burntHandler}>Burn</ButtonComponent>
        </div>
      </div>
    </div>
  );
};
export default Earn;
