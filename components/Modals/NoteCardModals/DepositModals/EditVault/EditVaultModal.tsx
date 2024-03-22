import TabsComponent from "@/components/reusable/TabsComponent";
import { TabsDataModel } from "@/models/TabsModel";
import React from "react";

interface EditVaultModalProps {
  tabsData: TabsDataModel[];
  logo: string;
}

const EditVaultModal: React.FC<EditVaultModalProps> = ({ tabsData, logo }) => {
  return (
    <TabsComponent
      tabsData={tabsData}
      logo={logo}
      inModal
    />
  );
};
export default EditVaultModal;
