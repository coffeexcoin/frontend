import React from "react";

interface AddVaultButtonProps {
  onClick?: () => void;
}

const AddVaultButton: React.FC<AddVaultButtonProps> = ({ onClick }) => {
  return (
    <div
      className="w-[100px] h-[100px] cursor-pointer bg-[#282828] flex"
      onClick={onClick ? onClick : () => {}}
    >
      <div className="font-semibold text-[#FAFAFA] m-auto text-sm text-center">
        <div className="mb-[2.5px]">+</div>
      </div>
    </div>
  );
};
export default AddVaultButton;
