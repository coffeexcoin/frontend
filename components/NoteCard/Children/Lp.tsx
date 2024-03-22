import LpStakeModal from "@/components/Modals/NoteCardModals/LpModals/LpStakeModal";
import TableComponent from "@/components/reusable/TableComponent";
import useModal from "@/contexts/modal";
import { LpColumns, LpRows, getLpModalData } from "@/mockData/tabsMockData";
import React from "react";

interface LpProps {
  totalStake: string;
  totalPercentage: string;
  momentum: string;
}

const Lp: React.FC<LpProps> = ({ totalStake, totalPercentage, momentum }) => {
  const { pushModal } = useModal();

  const onRowClickHandler = (key: string) => {
    pushModal(<LpStakeModal tabsData={getLpModalData(key)} logo={key} />);
    console.log(key);
  };
  return (
    <div>
      <div className="h-[150px]">
        <TableComponent
          columns={LpColumns}
          rows={LpRows}
          size="compact"
          onRowClick={onRowClickHandler}
        />
      </div>
      <div className="flex justify-between mt-[25px] text-sm font-semibold">
        <div className="flex">
          <div className="mr-[5px]">Total stake:</div>
          <div>{totalStake}</div>
        </div>
        <div className="flex">
          <div className="mr-[5px]">Total percentage:</div>
          <div>{totalPercentage}</div>
        </div>
        <div className="flex">
          <div className="mr-[5px]">Momentum:</div>
          <div>{momentum}</div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};
export default Lp;
