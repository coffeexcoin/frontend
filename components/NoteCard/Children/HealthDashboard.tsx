import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Input } from "@/components/ui/input";
import { useNoteHealth } from "@/hooks/useNoteHealth";
import claimData from "@/lib/snapshot-data.json";
import { formatNumber } from "@/lib/utils";
import { useCallback, useState } from "react";
import { isAddress } from "viem";

export const HealthDashboard = () => {
  const dnfts = useNoteHealth(
    "0xfaa785c041181a54c700fD993CDdC61dbBfb420f",
    "0xDc400bBe0B8B79C07A962EA99a642F5819e3b712"
  );

  return (
    <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
      <table className="text-[#A1A1AA] text-sm border-separate border-spacing-2">
        <thead>
          <tr>
            <th>Note Id</th>
            <th>Owner</th>
            <th>CR</th>
            <th>Collateral Value</th>
          </tr>
        </thead>
        <tbody>
          {dnfts.map((dnft) => (
            <tr key={dnft.id}>
              <td>{dnft.id}</td>
              <td className="font-mono"><a href={`https://etherscan.io/address/${dnft.owner}`}>{dnft.owner.toString()}</a></td>
              <td className="font-mono text-right">{formatNumber(dnft.collatRatio)}%</td>
              <td className="font-mono text-right">$ {formatNumber(dnft.usdValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
