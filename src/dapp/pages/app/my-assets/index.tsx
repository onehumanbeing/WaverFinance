import { NextPage } from "next";
import React, { useEffect } from "react";
import { RiWalletLine } from "react-icons/ri";
import { GoSettings } from "react-icons/go";
import { useNearUser } from "react-near";

import LayoutApp from "../../../components/LayoutApp";
import Card from "../../../components/Card";
import PanelInfo from "../../../components/PanelInfo";
import TrendDigital from "../../../components/TrendDigital";
import AddressId from "../../../components/AddressId";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import TokenInfo from "../../../components/TokenInfo";
import TokenAmount from "../../../components/TokenAmount";

import StorageIcon from "../../../assets/img/icons/storage.svg";

import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useQuanMainContract, useQuanMainGetContractQuery } from "../../../services/near/quan-main";

const BalanceCardPart: React.FC<{
  className: string,
  icon: React.ReactNode,
  title: React.ReactNode,
  value: React.ReactNode,
  extra?: React.ReactNode,
}> = ({ className, icon, title, value, extra }) => {

  const nearUser = useNearUser();
  const router = useRouter();
  const qmGetContract = useQuanMainGetContractQuery({
    variables: {
      account_id: nearUser?.address!,
    },
  })

  useEffect(() => {
    if(!nearUser?.loading && (!nearUser.address || !nearUser.isConnected)) {
      router.push("/");
      return;
    }

    if (!qmGetContract.loading && !qmGetContract.error && !qmGetContract.data?.length) {
      router.push("/create");
      return;
    }

  }, [
    nearUser, 
    nearUser?.address, 
    nearUser?.isConnected, 
    nearUser?.loading, 
    router, 
    qmGetContract?.data,
    qmGetContract?.error,
    qmGetContract?.loading,
  ]);

  return (
    <div className={`${styles.part} ${className ?? ""}`}>
      <div className={styles.iconBox}>
        <div className={styles.iconBox__icon}>
          {icon}
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>
          {value}
        </div>
        {extra && (
          <div className={styles.extra}>
            {extra}
          </div>
        )}
      </div>
    </div>
  )
}

const MyAssetsPage: NextPage = () => {
  return (
    <LayoutApp>
      <div className={styles.myAssetsPage__container}>
        <div className={styles.contractInfo}>
          <div className={styles.leftPart}>
            <Card 
              className={styles.balanceCard} 
              background="linear-gradient(307deg, #08036d 0%, #000796 43%, #5230e4 100%)"
            >
              <BalanceCardPart
                className={styles.balancePart}
                title="Available Balance"
                icon={<RiWalletLine />}
                value={<TrendDigital digital={1568.07} prefix="$ " />}
                extra={<TrendDigital digital={10} suffix="%" trend="up" />}
              />
              <BalanceCardPart
                className={styles.depositAmountPart}
                title="Deposit Amount"
                icon={<img className={styles.icon} src={StorageIcon.src} alt="storage icon" />}
                value={<TrendDigital digital={5} suffix=" NEAR" />}
                extra={<Button className={styles.withdrawBtn} type="minimal" schema="white">Withdraw</Button>}
              />
            </Card>
            <Card title="Smart Contract" className={styles.contractInfoCard}>
              <AddressId 
                className={styles.contractInfoCard__address} 
                addressId="opshenry.starark.near" 
                copyable
              />
              <div className={styles.version}>Version 1.0.0</div>
            </Card>
          </div>
          <div className={styles.rightPart}>
            <PanelInfo 
              className={styles.panelInfo}
              elements={[
                { 
                  title: "24h Transactions", 
                  content: <TrendDigital digital={30000} prefix="$ " />,
                },
                { 
                  title: "7d Transactions", 
                  content: <TrendDigital digital={30000} prefix="$ " />,
                },
                { 
                  title: "Active Trading", 
                  content: 3,
                },
                { 
                  title: "Active Strategy", 
                  content: 4,
                },
                { 
                  title: "Gas Burnt (NEAR)", 
                  content: 0.01,
                },
              ]}
            />
            <Card 
              className={styles.tokensCard} 
              title="Tokens"
              extra={<GoSettings />}
            >
              <Table 
                className={styles.tokensTable}
                columns={[
                  {
                    title: "Assets",
                    dataIndex: "contractId",
                    render: (contractId: string) => (
                      <TokenInfo contractId={contractId} showName showAddress />
                    )
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    render: (amount: string, { contractId }) => (
                      <div className={styles.amount}>
                        <div className={styles.amountBalance}>
                          <TokenAmount contractId={contractId} amount={amount} />
                        </div>
                        <div className={styles.amountUsd}>
                          ≈ $<TokenAmount contractId={contractId} amount={amount} usdMode />
                        </div>
                      </div>
                    )
                  },
                  {
                    title: "Action",
                    dataIndex: "contractId",
                  },
                ]}
                dataSource={[
                  { contractId: "near", amount: "10000" },
                  { contractId: "near", amount: "10000" },
                  { contractId: "near", amount: "10000" },
                ]}
              />
            </Card>
          </div>
        </div>
        <Card className={styles.recentActivityCard} title="Recent Activity">
          <Table
            className={styles.activityTable}
            columns={[
              {
                title: "Assets",
                dataIndex: "contractId",
                render: (contractId: string) => (
                  <TokenInfo contractId={contractId} showName />
                )
              },
              {
                title: "Action",
                dataIndex: "action",
                render: (amount: string, { contractId }) => (
                  <div className={styles.activityTable__action}>
                    Buy
                  </div>
                )
              },
              {
                title: "Type",
                dataIndex: "type",
                render: (amount: string, { contractId }) => (
                  <div className={styles.activityTable__type}>
                    Stragegy #1
                  </div>
                )
              },
              {
                title: "Amount In",
                dataIndex: "amount_in",
                render: (amount: string, { contractId }) => (
                  <div className={styles.activityTable__amountIn}>
                    1000 Near
                  </div>
                )
              },
              {
                title: "Amount Out",
                dataIndex: "amount_out",
                render: (amount: string, { contractId }) => (
                  <div className={styles.activityTable__amountOut}>
                    30,000 USDC
                  </div>
                )
              },
              {
                title: "Created At",
                dataIndex: "created_at",
                render: (amount: string, { contractId }) => (
                  <div className={styles.activityTable__amountOut}>
                    {new Date("2022-1-1").toLocaleString()}
                  </div>
                )
              },
            ]}
            dataSource={[
              { contractId: "near", amount: "10000" },
              { contractId: "near", amount: "10000" },
              { contractId: "near", amount: "10000" },
            ]}
          />
        </Card>
      </div>
    </LayoutApp>
  )
}

export default MyAssetsPage;
