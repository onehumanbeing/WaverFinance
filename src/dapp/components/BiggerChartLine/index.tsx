import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  
} from "chart.js";
import { Line } from "react-chartjs-2";

import Card from "../../components/Card";

import styles from "./index.module.scss";

ChartJS.register(
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  CategoryScale,
  Tooltip,
);

interface IBiggerChartData {
  time: string;
  value: number;
}

const BiggerChartLine: React.FC<{
  className?: string;
  data: IBiggerChartData[];
}> = ({ className, data }) => {
  return (
    <div className={`${className} ${styles.biggerChartLine__container}`}>
      <Line
        data={{
          labels: data.map((item) => item.time),
          datasets: [
            {
              data: data.map((item) => item.value),
              borderWidth: 2.5,
              borderColor: '#e50e0c',
              backgroundColor: '#e50e0c',
              // cubicInterpolationMode: 'monotone',
              tension: 0.4,
              pointStyle: 'circle',
              pointRadius: 2.5,
              pointHoverRadius: 5,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            tooltip: {}
          },
          interaction: {
            intersect: false,
          },
        }}
      />
    </div>
  );
};

export default BiggerChartLine;
