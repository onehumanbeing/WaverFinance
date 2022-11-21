import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

import DemoMode from "../DemoMode";

import styles from "./index.module.scss";
import waverApi, {
  TWaverHistory,
  TWaverActivity,
} from "../../services/rest/waver";
import { useClientContractId } from "../../services/near/quan-client";

const getOptions = (history: TWaverHistory[], activities: TWaverActivity[]) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    // legend: {},
    // toolbox: {
    //   show: true,
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: 'none'
    //     },
    //     restore: {},
    //     saveAsImage: {}
    //   }
    // },
    xAxis: {
      type: "time",
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "${value}",
      },
      scale: true,
      splitLine: { show: false },
    },
    // dataZoom: [
    //   {
    //     type: 'inside',
    //   },
    //   {}
    // ],
    series: [
      {
        name: "Price",
        type: "line",
        smooth: true,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "#888dc9", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#546ecd", // 100% 处的颜色
              },
            ],
            globalCoord: false,
          },
        },
        data: history.map((item) => [new Date(item.updated), item.price]),
        markPoint: {
          symbolSize: 60,
          data: activities.map((item) => {
            const isSale = item.amount_in_contract === "wrap.testnet";
            return {
              value: isSale ? "SALE" : "BUY",
              xAxis: new Date(item.updated),
              yAxis: item.price,
              itemStyle: {
                color: isSale ? "#c05858" : "#58c059",
              },
              label: {
                // formatter: name,
                // position: 'top',
                color: "#fff",
              },
            };
          }),
        },
        markLine: {
          label: {
            color: "#fff",
          },
          data: [{ type: "average", name: "Avg" }],
        },
        lineStyle: {
          width: 4,
        },
      },
    ],
  };
};

const getDemoOptions = () => {
  const history: any[] = [
    {
      updated: "2021-08-01T00:00:00.000Z",
      price: 3.2,
    },
    {
      updated: "2021-08-02T00:00:00.000Z",
      price: 2.1,
    },
    {
      updated: "2021-08-03T00:00:00.000Z",
      price: 1.6,
    },
    {
      updated: "2021-08-04T00:00:00.000Z",
      price: 3.6,
    },
    {
      updated: "2021-08-05T00:00:00.000Z",
      price: 5,
    },
    {
      updated: "2021-08-06T00:00:00.000Z",
      price: 2.3,
    },
    {
      updated: "2021-08-07T00:00:00.000Z",
      price: 3.5,
    },
    {
      updated: "2021-08-08T00:00:00.000Z",
      price: 2.1,
    },
    {
      updated: "2021-08-09T00:00:00.000Z",
      price: 2.2,
    },
  ];
  const activities: any = [
    {
      updated: "2021-08-03T00:00:00.000Z",
      price: 1.6,
    },
    {
      updated: "2021-08-05T00:00:00.000Z",
      price: 5,
      amount_in_contract: "wrap.testnet",
    },
    {
      updated: "2021-08-08T00:00:00.000Z",
      price: 2.1,
    },
  ];

  return getOptions(history, activities);
};

const BiggerChartLine: React.FC<{
  className?: string;
  tokenId?: string;
  demo?: boolean;
}> = ({ className, tokenId, demo }) => {
  const { contractId } = useClientContractId();
  const [options, setOptions] = useState<any>();

  // useEffect(() => {
  //   if (!tokenId || !contractId) {
  //     return
  //   }
  //   (async () => {
  //     const data = await waverApi.getTokenPriceHistory(tokenId);
  //     const activities = await waverApi.getRecentActivities(contractId);
  //     console.log({ data, activities })
  //     const options = getOptions(data.list, activities.list);
  //     setOptions(options)
  //   })()
  // }, [tokenId, contractId])

  useEffect(() => {
    if (!demo) {
      return;
    }
    setOptions(getDemoOptions);
  }, [demo]);

  return (
    <div className={`${className} ${styles.biggerChartLine__container}`}>
      { demo && <DemoMode className={styles.demo} /> }
      {options && (
        <ReactECharts
          style={{
            height: "400px",
          }}
          option={options}
        />
      )}
    </div>
  );
};

export default BiggerChartLine;
