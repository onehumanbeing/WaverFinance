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

interface IChartData {
  name: string;
  value: number;
}

const CardChartLine: React.FC<{
  className?: string;
  title: string;
  data: IChartData[];
}> = ({ className, title, data }) => {
  return (
    <Card
      className={`${styles.cardChartLine} ${className ?? ""}`}
      background="#0e0e0c"
    >
      <div className={styles.cardChartLine__title}>{title}</div>
      <div className={styles.cardChartLine__chart}>
        <Line
          data={{
            labels: data.map((item) => item.name),
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
    </Card>
  );
};

export default CardChartLine;
