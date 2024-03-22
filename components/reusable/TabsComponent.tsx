import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { TabsDataModel } from "@/models/TabsModel";
import { cn } from "@/lib/utils";

interface tabsComponentPropsInterface {
  tabsData: TabsDataModel[];
  logo?: string | JSX.Element;
  inModal?: boolean;
}

export default function TabsComponent({
  tabsData,
  logo,
  inModal = false,
}: tabsComponentPropsInterface) {
  return (
    <div
      className={cn("w-full px-2 flex relative", inModal && "max-w-[464px] pr-6")}
    >
      <div className={cn("w-full", inModal && "max-w-[464px]")}>
        {logo && (
          <div className="h-7 w-1/6 absolute flex">
            <div className="w-full h-7 text-2xl">{logo}</div>
          </div>
        )}
        <Tabs
          variant="underlined"
          aria-label="Tabs variants"
          className="p-0 w-full"
          classNames={{
            base: "w-full",
            tabList: `justify-between ${
              logo ? "w-4/6" : "w-full"
            } relative rounded-none p-0 border-b border-divider ml-auto`,
            cursor: "w-full bg-[#FAFAFA]",
            tab: "max-w-fit h-7 font-semibold",
          }}
        >
          {tabsData.map((tab: any) => (
            <Tab key={tab.tabKey} title={tab.label}>
              <div className=" overflow-clip">{tab.content}</div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
    // </div>
  );
}
