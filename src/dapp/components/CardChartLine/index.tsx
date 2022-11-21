import React from "react";
import ReactECharts from "echarts-for-react";

import Card from "../../components/Card";

import styles from "./index.module.scss";
import ErrorBoundary from "../ErrorBoundary";
import DemoMode from "../DemoMode";

interface IChartData {
  name: string;
  value: number;
}


const getOptions = (data: IChartData[]) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}",
      },
      scale: true,
      splitLine: { show: false },
    },
    grid: {
      x: 30,
      y: 10,
      x2: 10,
      y2: 20,
    },
    series: [
      {
        name: "Price",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: "#e50e0c",
        },
        data: data.map(({name, value}) => [name, value]),
        lineStyle: {
          width: 2,
        },
      },
    ],
  };
};

const CardChartLine: React.FC<{
  className?: string;
  title: string;
  data: IChartData[];
  demo?: boolean;
}> = ({ className, title, data, demo }) => {
  return (
    <Card
      className={`${styles.cardChartLine} ${className ?? ""}`}
      background="#0e0e0c"
    >
      <div className={styles.cardChartLine__title}>{title}</div>
      <div className={styles.cardChartLine__chart}>
        { demo && <DemoMode /> }
        <ErrorBoundary>
          <ReactECharts
            style={{
              height: "150px",
            }}
            option={getOptions(data)}
          />
        </ErrorBoundary>
      </div>
    </Card>
  );
};

export default CardChartLine;
