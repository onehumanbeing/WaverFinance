import React, { useState, useEffect, useCallback } from "react";
import { NextPage } from "next";
import { useNearUser } from "react-near";
import LayoutApp from "../../../components/LayoutApp";
import Card from "../../../components/Card";
import Table from "../../../components/Table";
import PrimaryButton from "../../../components/ButtonPrimary";
import Button from "../../../components/Button";
import TokenInfo from "../../../components/TokenInfo";
import BiggerChartLine from "../../../components/BiggerChartLine";

import styles from "./index.module.scss";
import StrategyModal from "../../../components/StrategyModal";
import { EStrategyType, EStrategyStatus, getQuanClientStrategy, getQuanClientStrategyList, IStrategyInfo, useClientContractId } from "../../../services/near/quan-client";

const CreateBtn: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <div className={styles.createBtn__container} onClick={onClick}>
      {children}
    </div>
  );
};
const CircleIcon: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <div className={styles.circleIcon}>{children}</div>;
};

const MyStrategyTable: React.FC<{
  onEdit?: (strategyId: string) => void;
}> = ({ onEdit }) => {
  const [data, setData] = useState<IStrategyInfo[]>();
  const nearUser = useNearUser();
  const { contractId } = useClientContractId();

  useEffect(() => {
    if (!nearUser.account || !contractId) {
      return;
    }

    const getStrategy = getQuanClientStrategy(nearUser.account, contractId);

    getQuanClientStrategyList(nearUser.account, contractId)().then((ids) => {
      console.log("get strategys id:", ids);
      
      return Promise.all(ids.map(async id => { 
        const info = await getStrategy(id);
        return { id, ...info };
      }));
    }).then((value) => {
      console.log("get strategys:", value);
      setData(value);
    })
  }, [contractId, nearUser.account])

  return (
    <Table 
      className={styles.tokensTable}
      columns={[
        {
          title: "Name",
          dataIndex: "id",
          render: (id) => (<b>Strategy #{id}</b>)
        },
        {
          title: "Type",
          dataIndex: "stype",
          render: (stype: any) => {
            if (stype === EStrategyType.BUY) {
              return "Buy";
            }
            if (stype === EStrategyType.SALE) {
              return "SALE";
            }
            if (stype === EStrategyType.GRID) {
              return "Grid Trading";
            }
            return "Others";
          }
        },
        {
          title: "Asset",
          dataIndex: "stype",
          render: (stype: string, { target_ft, invest_ft }) => (
            <div className={styles.strategyTokens}>
              <TokenInfo className={styles.strategyTokens__target_ft} contractId={target_ft} />
              <TokenInfo className={styles.strategyTokens__invest_ft} contractId={invest_ft} />
            </div>
          )
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (status: any) => {
            if (status === EStrategyStatus.INIT) {
              return "Init";
            }
            if (status === EStrategyStatus.ACTIVE) {
              return "Active";
            }
            if (status === EStrategyStatus.PAUSED) {
              return "Paused";
            }
            if (status === EStrategyStatus.ENDED) {
              return "Ended";
            }
            if (status === EStrategyStatus.FAILED) {
              return "Failed";
            }
            return "Others";
          }
        },
        {
          title: "Action",
          dataIndex: "id",
          render: (id: string) => (
            <Button type="pure" onClick={() => onEdit?.(id)}>Edit</Button>
          )
        },
      ]}
      dataSource={data ?? []}
    />
  )
};

const MyStrategyPage: NextPage = () => {
  const [active, setActive] = useState<boolean>(false);
  const [strategyId, setStrategyId] = useState<string>();

  const create = useCallback(() => {
    setActive(true);
    setStrategyId(undefined);
  }, []);

  const edit = useCallback((id: string) => {
    setActive(true);
    setStrategyId(id);
  }, []);

  return (
    <LayoutApp>
      <StrategyModal
        active={active}
        onClose={() => { setActive(!active) }}
        nowId={strategyId}
      />
      <div className={styles.myStrategyPage__container}>
        <div className={styles.firstRow}>
          <div className={styles.createCard}>
            <h1 className={styles.title}>Create Your Very Own Strategy</h1>
            <p className={styles.description}>
              Create your own strategy and earn passive income by lending your
              assets to the community.
            </p>

            <PrimaryButton className={styles.mainCreateBtn} onClick={create}>
              Create
            </PrimaryButton>
          </div>
          <Card
            className={styles.myStrategyCard}
            title="My Strategy"
            extra={
              <Button type="minimal" schema="transparent" onClick={create}>
                <div className={styles.createBtn}>
                  <div>
                    Create 
                  </div>
                  <CircleIcon>
                    +
                  </CircleIcon>
                </div>
              </Button>
            }
          >
            <MyStrategyTable onEdit={edit} />
          </Card>
        </div>
        <div className={styles.secondRow}>
          <div className={styles.title}>Overview</div>
          <BiggerChartLine
            tokenId={"wrap.testnet"} demo
          />
        </div>
      </div>
    </LayoutApp>
  )
}

export default MyStrategyPage;
