import NoteCardsContainer from "@/components/reusable/NoteCardsContainer";
import TabsComponent from "@/components/reusable/TabsComponent";
import { TabsDataModel } from "@/models/TabsModel";
import React from "react";

interface EditVaultModalProps {
  tabsData: TabsDataModel[];
  logo: string;
}

const LpStakeModal: React.FC<EditVaultModalProps> = ({ tabsData, logo }) => {
  return (
    <div>
      <NoteCardsContainer>
        <TabsComponent
          tabsData={tabsData}
          logo={<div className="text-2xl font-semibold">{logo}</div>}
        />
      </NoteCardsContainer>
    </div>
  );
};
export default LpStakeModal;
