import React, { useState } from "react";
import { NextPage } from "next";
import LayoutApp from "../../../components/LayoutApp";
import Card from "../../../components/Card";
import Table from "../../../components/Table";
import PrimaryButton from "../../../components/ButtonPrimary";
import Button from "../../../components/Button";
import TokenInfo from "../../../components/TokenInfo";
import BiggerChartLine from "../../../components/BiggerChartLine";

import styles from "./index.module.scss";
import Modal from "../../../components/Modal";
import Tag from "../../../components/Tag";
import Input from "../../../components/Input";
import { getNearConfig } from "../../../configs/near";

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

const CreateStrategyModal: React.FC<{
  active: boolean;
  onClose: () => void;
}> = ({ active, onClose }) => {
  const config = getNearConfig();

  const strategyTypeOptions = [
    { key: "1", value: "Buy" },
    { key: "2", value: "Sale" },
    { key: "3", value: "Grid Trading" },
  ];
  const targetAssetsOptions = Object.entries(config.supportTargetFt).map(
    ([key, value]) => ({ key, value })
  );
  const investAssetsOptions = Object.entries(config.supportInvestFt).map(
    ([key, value]) => ({ key, value })
  );

  const expressionOptions = [
    { key: "1", value: "≥" },
    { key: "2", value: "≤" },
  ];

  const [targetAssets, setTargetAssets] = useState<string>();
  const [investAssets, setInvestAssets] = useState<string>();
  const [strategyType, setStrategyType] = useState<string>("1");
  
  // buy or sell
  const [price, setPrice] = useState<number>(1);
  const [amount, setAmount] = useState<string>("1");

  // grid trading
  const [gridInterval, setGridInterval] = useState<string>("1");
  const [gridSize, setGridSize] = useState<string>("1");
  const [highestPrice, setHighestPrice] = useState<string>("1");
  const [lowestPrice, setLowestPrice] = useState<string>("1");

  const actions = (
    <>
      <Button schema="danger" className={styles.modalBtn} size="middle">
        Delete
      </Button>
    </>
  )

  return (
    <Modal active={active} onClose={onClose} action={actions}>
      <div className={styles.createStrategyModal}>
        <div className={styles.modal__head}>
          <Tag color={"#8fe694"}>Active</Tag>
          <h1 className={styles.title}>Update Strategy</h1>
          <p className={styles.description}>
            {/* TODO: 海天爸爸记得写这里 */}
          </p>
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.part}>
            <div className={styles.part__number}>1</div>
            <div className={styles.part__content}>
              <div className={styles.part__content__title}>
                Select Trade Target
              </div>
              <div className={styles.part__content__input_group}>
                <Input
                  title="Target Asset"
                  type="select"
                  options={targetAssetsOptions}
                  value={targetAssets}
                  onChange={setTargetAssets}
                />
                <Input
                  title="Invest Asset"
                  type="select"
                  options={investAssetsOptions}
                  value={investAssets}
                  onChange={setInvestAssets}
                />
              </div>
            </div>
          </div>
          <div className={styles.part}>
            <div className={styles.part__number}>2</div>
            <div className={styles.part__content}>
              <div className={styles.part__content__title}>
                Select Strategy Type
              </div>
              <div className={styles.part__content__input_group}>
                <Input
                  title="Strategy Type"
                  type="select"
                  options={strategyTypeOptions}
                  value={strategyType}
                  onChange={setStrategyType}
                />
              </div>
            </div>
          </div>
          <div className={styles.part}>
            <div className={styles.part__number}>3</div>
            <div className={styles.part__content}>
              <div className={styles.part__content__title}>
                Fill in Strategy Details
              </div>
              <div className={styles.part__content__input_group}>
                {
                  ["1", "2"].includes(strategyType) && (
                    <>
                      <Input
                        title="Expression"
                        type="select"
                        options={expressionOptions}
                        value={targetAssets}
                        onChange={setTargetAssets}
                      />
                      <Input
                        title="Price ($ per FT)"
                        type="number"
                        value={price}
                        onChange={(val) => setPrice(parseFloat(val))}
                      />
                      <Input
                        title="Amount"
                        type="number"
                        options={expressionOptions}
                        value={amount}
                        onChange={(val) => setAmount(val)}
                      />
                    </>
                  )
                }
                {
                  strategyType === "3" && (
                    <>
                      <Input
                        title="Grid Interval"
                        type="number"
                        value={gridInterval}
                        onChange={(val) => setGridInterval(val)}
                      />
                      <Input
                        title="Grid Size"
                        type="number"
                        value={gridSize}
                        onChange={(val) => setGridSize(val)}
                      />
                      <Input
                        title="Highest Price"
                        type="number"
                        value={highestPrice}
                        onChange={(val) => setHighestPrice(val)}
                      />
                      <Input
                        title="Lowest Price"
                        type="number"
                        value={lowestPrice}
                        onChange={(val) => setLowestPrice(val)}
                      />
                    </>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
};

const MyStrategyPage: NextPage = () => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <LayoutApp>
      <CreateStrategyModal active={active} onClose={() => { setActive(!active) }} />
      <div className={styles.myStrategyPage__container}>
        <div className={styles.firstRow}>
          <div className={styles.createCard}>
            <h1 className={styles.title}>Create Your Very Own Strategy</h1>
            <p className={styles.description}>
              Create your own strategy and earn passive income by lending your
              assets to the community.
            </p>

            <PrimaryButton className={styles.mainCreateBtn}>
              Create
            </PrimaryButton>
          </div>
          <Card
            className={styles.myStrategyCard}
            title="My Strategy"
            extra={
              <Button type="minimal" schema="transparent" onClick={() => setActive(true)}>
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
            <Table 
              className={styles.tokensTable}
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  render: (name: string) => (<b>Strategy #1</b>)
                },
                {
                  title: "Type",
                  dataIndex: "type",
                  render: (status: string, { contractId }) => (
                    "Grid Trading"
                  )
                },
                {
                  title: "Asset",
                  dataIndex: "asset",
                  render: (amount: string, { contractId }) => (
                    <TokenInfo contractId={contractId} />
                  )
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (status: string, { contractId }) => (
                    "Active"
                  )
                },
                {
                  title: "Action",
                  dataIndex: "contractId",
                  render: (amount: string, { contractId }) => (
                    <Button type="pure">Edit</Button>
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
        <div className={styles.secondRow}>
          <div className={styles.title}>Overview</div>
          <BiggerChartLine data={[]} />
        </div>
      </div>
    </LayoutApp>
  )
}

export default MyStrategyPage;
