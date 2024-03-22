import { VaultCardDataModel } from "@/models/NoteCardModels";
import React from "react";

interface VaultCardProps {
  data: VaultCardDataModel;
  onClick?: () => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ data, onClick }) => {
  return (
    <div
      className="w-[100px] h-[100px] cursor-pointer bg-[#282828] flex"
      onClick={onClick}
    >
      <div className="font-semibold text-[#FAFAFA] m-auto text-sm text-center">
        <div className="mb-[2.5px]">{data.currency}</div>
        <div className="mt-[2.5px]">{data.value}</div>
      </div>
    </div>
  );
};
export default VaultCard;
