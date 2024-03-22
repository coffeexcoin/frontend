"use client";

import React from "react";
import { NoteNumberDataColumnModel } from "@/models/NoteCardModels";
import {
  PIE_CHART_MOCK_DATA,
  PIE_CHART_OPTIONS,
} from "@/mockData/tabsMockData";
import PieChartComponent, { Data } from "@/components/reusable/PieChartComponent";

interface NoteNumberProps {
  data: NoteNumberDataColumnModel[];
  dyad: number[];
  collateral: Data[];
}

const NoteNumber: React.FC<NoteNumberProps> = ({ data, dyad, collateral }) => {
  const dyadData = [
    {
      label: "DYAD mintable",
      value: dyad[0],
    },
    {
      label: "DYAD minted",
      value: dyad[1],
    },
  ];

  return (
    <div className="flex justify-between">
      <div className="flex justify-between w-full text-[#FAFAFA] px-3.5">
        <div className="w-[295px] justify-center mt-[20px]">
          <div className="w-[185px] m-auto">
            <PieChartComponent
              outsideData={dyadData}
              insideData={collateral}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const { dataIndex, dataset } = context;
                        return `  ${dataset.labels[dataIndex]}:  ${typeof dataset.data[dataIndex] === "string" ? "$" : ""}${dataset.data[dataIndex]}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="mt-[27px]">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className={`flex w-60 justify-between mb-[25px] text-sm ${
                item.highlighted ? "text-[#FAFAFA]" : "text-[#A1A1AA]"
              }`}
            >
              <div>{item.text}</div>
              <div className="text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NoteNumber;
