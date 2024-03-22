import { formatNumber } from "@/lib/utils";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

export type Data = {
  label: string;
  value: number;
};

interface PieChartComponentProps {
  outsideData: Data[];
  insideData: Data[];
  options?: any;
}

const CustomTooltip = ({ active, payload }: {active: any, payload: any}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border rounded-md p-4">
        <p className="label">{`${payload[0].payload.label} : ${!payload[0].payload.label.includes('DYAD') ? `$${formatNumber(payload[0].value)}` : payload[0].value}`}</p>
      </div>
    );
  }
};

const insideFillColors = ["#8D8D8D", "#676767", "#EDEDED"];
const outsideFillColors = ["#44e845", "white"];
const PieChartComponent: React.FC<PieChartComponentProps> = ({
  insideData,
  outsideData,
  options = {},
}) => {
  console.log(outsideData, insideData);
  return (
    <PieChart width={185} height={185}>
      <Pie data={insideData} dataKey="value" outerRadius={60}>
        {insideData?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={insideFillColors[index]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Pie data={outsideData} dataKey="value" innerRadius={70} outerRadius={80}>
        {outsideData?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={outsideFillColors[index]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieChartComponent;
