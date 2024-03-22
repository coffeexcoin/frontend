import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface PieChartComponentProps {
  data: any;
  options?: any;
}
const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  options = {},
}) => {
  return <Pie options={options} data={data} />;
};

export default PieChartComponent;
