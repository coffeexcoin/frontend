import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Input } from "@/components/ui/input";
import claimData from "@/lib/snapshot-data.json";
import { useState } from "react";
import { isAddress } from "viem";

export const SnapshotClaim = () => {
  const [address, setAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);

  const handleCheck = () => {
    if (isAddress(address)) {
      setInvalidAddress(false);
      const data = claimData.find((data) => data.address === address);
      setButtonClicked(true);
      setClaimAmount(data?.amount || 0);
    } else {
      setInvalidAddress(true);
    }
  };

  return (
    <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
      <div className="flex justify-between items-center gap-6">
        <Input
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setButtonClicked(false);
            setInvalidAddress(false);
          }}
          placeholder="Enter address to check eligibility..."
        />
        <div className="w-[200px]">
          <ButtonComponent onClick={handleCheck}>Check</ButtonComponent>
        </div>
      </div>
      {invalidAddress && <p className="text-red-500">Invalid Address</p>}
      {buttonClicked && (
        <div className="flex gap-8 items-center">
          <p>Address: {address}</p>
          {claimAmount > 0 ? (
            <p className="text-green-500">{claimAmount} Kerosene</p>
          ) : (
            <p className="text-red-500">Not Eligible</p>
          )}
        </div>
      )}
    </div>
  );
};
