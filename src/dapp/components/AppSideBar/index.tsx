import React from "react";
import { useClientTokens } from "../../hooks/waver";
import BalanceCard from "../BalanceCard";
import CardChartLine from "../CardChartLine";
import NotificationBtn from "../NoticationBtn";
import PanelInfo from "../PanelInfo";
import TrendDigital from "../TrendDigital";
import UserInfo from "../UserInfo";

import styles from "./index.module.scss";

const PanelInfoWithTotal: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  const { data: tokenInfo } = useClientTokens();

  return (
    <PanelInfo
      className={className}
      style={style}
      elements={[
        {
          title: "Total Invest",
          content: <TrendDigital digital={tokenInfo?.total_token_amount} mode="brief" prefix="$" />,
        },
        {
          title: "Total Earning",
          content: <TrendDigital digital={tokenInfo?.total_token_amount && (tokenInfo.total_token_amount * 0.2)} mode="brief" prefix="$" trend="up" />,
        },
        {
          title: "Total Assets",
          content: tokenInfo?.list.length ?? "-",
        },
      ]}
    />
  );
};

const AppSideBar: React.FC = () => {
  return (
    <div className={styles.appSideBar}>
      <div className={styles.appSideBar__topBar}>
        {/* <NotificationBtn number={12} /> */}
        <div />
        <UserInfo />
      </div>
      <div className={styles.analysisReport}>
        <div className={styles.appSideBar__title}>Analysis Report</div>
        <div className={styles.appSideBar__content}>
          <BalanceCard />
          <PanelInfoWithTotal className={styles.analysisReport__panel} />
        </div>
        <div className={styles.chartGroup}>
          <CardChartLine 
            title="Total Amount" 
            data={[
              { name: "JUL", value: 80 },
              { name: "AUG", value: 100 },
              { name: "SEP", value: 70 },
              { name: "OCT", value: 80 },
              { name: "NOV", value: 125 },
              { name: "DEC", value: 85 },
            ]}
          />
          <CardChartLine 
            title="Daily Active Trading" 
            data={[
              { name: "JUL", value: 80 },
              { name: "AUG", value: 120 },
              { name: "SEP", value: 80 },
              { name: "OCT", value: 70 },
              { name: "NOV", value: 105 },
              { name: "DEC", value: 80 },
            ]}
          />
          <CardChartLine 
            title="Daily Gas Usage" 
            data={[
              { name: "JUL", value: 80 },
              { name: "AUG", value: 100 },
              { name: "SEP", value: 70 },
              { name: "OCT", value: 80 },
              { name: "NOV", value: 125 },
              { name: "DEC", value: 85 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default AppSideBar;
