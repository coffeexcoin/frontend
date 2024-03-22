import React from "react";
import filterIcon from "@/public/filterIconPng.png";
import PopupComponent from "@/components/reusable/PopupComponent";
import ButtonComponent from "./ButtonComponent";
import { RadioGroup, Radio } from "@nextui-org/react";

interface SortOptionsInterface {
  label: string;
  value: string;
}

interface SortbyComponentProps {
  selected: string;
  onValueChange: (selectedValue: string) => void;
  sortOptions: SortOptionsInterface[];
  label?: string;
}

const SortbyComponent: React.FC<SortbyComponentProps> = ({
  label = "Sort by",
  sortOptions,
  selected,
  onValueChange,
}) => {
  return (
    <PopupComponent
      trigger={
        <div>
          <ButtonComponent
            styles={{
              width: "40px",
              paddingRight: "0px",
              paddingLeft: "0px",
            }}
          >
            <div
              style={{
                width: "15px",
                margin: "auto",
              }}
            >
              <img src={filterIcon.src} />
            </div>
          </ButtonComponent>
        </div>
      }
      content={
        <div className="p-[20px]">
          <RadioGroup
            classNames={{
              label: "text-[#FAFAFA] text-sm font-semibold",
            }}
            label={label}
            value={selected}
            onValueChange={onValueChange}
          >
            {sortOptions.map((sortOption: SortOptionsInterface) => (
              <Radio
                classNames={{
                  base: "pt-[15px]",
                  label: "text-[#FAFAFA] text-sm font-semibold ",
                }}
                value={sortOption.value}
              >
                {sortOption.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      }
    />
  );
};
export default SortbyComponent;
