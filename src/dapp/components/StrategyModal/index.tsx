import { formatNearAmount, parseNearAmount } from "near-api-js/lib/utils/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNearUser } from "react-near";
import { getNearConfig } from "../../configs/near";
import { QUAN_CLIENT_STORAGE_PREFIX } from "../../constants/client";
import { GAS_FEE } from "../../constants/gasFee";
import { 
  useQuanClientWallet as useQuanClientWallet, 
  useQuanClientCreateStrategyMutation, 
  createStrategyByWallet, 
  updateStrategyByWallet, 
  useClientContractId, 
  getQuanClientStrategy,
  removeStrategyByWallet,
} from "../../services/near/quan-client";
import { EStrategyType, EStrategyStatus } from "../../services/near/quan-client";
import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import Tag from "../Tag";

import styles from "./index.module.scss";

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

const targetAssetsDefault = targetAssetsOptions[0]?.key;
const investAssetsDefault = investAssetsOptions[0]?.key;
const strategyTypeDefault = "1";

// Buy / Sell Default
const expressionDefault = "1";
const priceDefault = 1;
const amountDefault = 1;

// Grid Trading Default
const gridIntervalDefault = 1;
const gridSizeDefault = 1;
const highestPriceDefault = 1;
const lowestPriceDefault = 1;

const isBuyOrSaleType = (strategyType: string) => {
  return ["1", "2"].includes(strategyType);
};

const to5Decimal = (value: number) => {
  return Math.floor(value * 100000);
}

const from5Decimal = (value: number) => {
  return value / 100000;
}

const StatusTag: React.FC<{
  status?: EStrategyStatus;
}> = ({ status }) => {
  const statusMap = {
    [EStrategyStatus.INIT]: {
      text: "Init",
      color: "gray",
    },
    [EStrategyStatus.ACTIVE]: {
      text: "Active",
      color: "#8fe694",
    },
    [EStrategyStatus.PAUSED]: {
      text: "Paused",
      color: "#f7b500",
    },
    [EStrategyStatus.ENDED]: {
      text: "Ended",
      color: "blue",
    },
    [EStrategyStatus.FAILED]: {
      text: "Failed",
      color: "red",
    },
  };

  if (!status) {
    return null;
  }

  return (
    <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
  )
}

const StrategyModal: React.FC<{
  active: boolean;
  onClose: () => void;
  nowId?: string;
}> = ({ active, onClose, nowId }) => {

  const [targetAssets, setTargetAssets] = useState<string>(targetAssetsDefault);
  const [investAssets, setInvestAssets] = useState<string>(investAssetsDefault);
  const [strategyType, setStrategyType] = useState<string>(strategyTypeDefault);
  
  const [status, setStatus] = useState<EStrategyStatus>();

  // buy or sell
  const [expression, setExpression] = useState<string>(expressionDefault);
  const [price, setPrice] = useState<number>(priceDefault);
  const [amount, setAmount] = useState<number>(amountDefault);

  // grid trading
  const [gridInterval, setGridInterval] = useState<number>(gridIntervalDefault);
  const [gridSize, setGridSize] = useState<number>(gridSizeDefault);
  const [highestPrice, setHighestPrice] = useState<number>(highestPriceDefault);
  const [lowestPrice, setLowestPrice] = useState<number>(lowestPriceDefault);

  const [loading, setLoading] = useState<boolean>(false);

  const clientContractId = useClientContractId();
  const clientWallet = useQuanClientWallet();
  const nearUser = useNearUser();

  const [disableCreateOrUpdateBtn, setDisableCreateOrUpdateBtn] = useState<boolean>(true);

  useEffect(() => {
    // login if not login to client contract
    if (active && clientWallet) {
      if (!clientWallet.isSignedIn()) {
        // TODO: what if our user login a different account
        clientWallet.requestSignIn();
        return;
      }
      const account = clientWallet.account();
      if (account.accountId !== nearUser.address) {
        alert(`You need to login the SAME account (${nearUser.address}) for the client contract as the main contract. You should Login again!`);
        clientWallet.signOut();
        clientWallet.requestSignIn();
        return;
      }
    }
  }, [clientWallet, active, nearUser.address])

  const validate = useCallback(() => {
    if (!targetAssets || !investAssets || !strategyType) {
      return false;
    }

    if (["1", "2"].includes(strategyType)) {
      // Buy or Sell Check
      if (!expression) {
        return false;
      }
      if (!price || price <= 0 || !amount || amount <= 0) {
        return false;
      }
    }

    if (strategyType === "3") {
      // Grid Check
      if (!gridInterval || !gridSize || !highestPrice || !lowestPrice) {
        return false;
      }

      if (highestPrice <= lowestPrice) {
        return false;
      }
    }

    return true;
  }, [
    targetAssets,
    investAssets,
    strategyType,
    expression,
    price,
    amount,
    gridInterval,
    gridSize,
    highestPrice,
    lowestPrice,
  ])

  useEffect(() => {
    setDisableCreateOrUpdateBtn(!validate());
  }, [validate])

  const handleCreateOrUpdate = async () => {
    if(disableCreateOrUpdateBtn) {
      return;
    }

    if (!clientContractId.contractId || !clientWallet) {
      alert("Preparing, please wait!");
      return;
    }

    if (nowId === undefined) {
      // Create
      const createStrategy = createStrategyByWallet(clientContractId.contractId, clientWallet);

      if (isBuyOrSaleType(strategyType)) {
        const stype = parseInt(strategyType);
        const amountStr = stype === EStrategyType.BUY ? to5Decimal(amount).toString() : parseNearAmount(amount.toString())!;

        await createStrategy({
          target_ft: targetAssets,
          invest_ft: investAssets,
          stype,
          expression: parseInt(expression),
          target_price: to5Decimal(price),
          // TODO: Need to trans to others if not NEAR
          amount: amountStr,
        });
      } else {
        await createStrategy({
          stype: EStrategyType.GRID,
          target_ft: targetAssets,
          invest_ft: investAssets,
          // TODO: Need to trans to others if not NEAR
          grid_size: parseNearAmount(gridSize.toString())!,
          grid_intervel: to5Decimal(gridInterval),
          highest_price: to5Decimal(highestPrice),
          lowest_price: to5Decimal(lowestPrice),
        });
      }
    } else {
      // Update
      const updateStrategy = updateStrategyByWallet(clientContractId.contractId, clientWallet);

      if (isBuyOrSaleType(strategyType)) {
        await updateStrategy(nowId, {
          target_ft: targetAssets,
          invest_ft: investAssets,
          stype: parseInt(strategyType),
          expression: parseInt(expression),
          target_price: to5Decimal(price),
          // TODO: Need to trans to others if not NEAR
          amount: parseNearAmount(amount.toString())!,
        });
      } else {
        await updateStrategy(nowId, {
          stype: EStrategyType.GRID,
          target_ft: targetAssets,
          invest_ft: investAssets,
          // TODO: Need to trans to others if not NEAR
          grid_size: parseNearAmount(gridSize.toString())!,
          grid_intervel: to5Decimal(gridInterval),
          highest_price: to5Decimal(highestPrice),
          lowest_price: to5Decimal(lowestPrice),
        });
      }
    }
  }

  const handleRemove = async () => {
    if (!clientContractId.contractId || !clientWallet) {
      alert("Preparing, please wait!");
      return;
    }
    if (nowId === undefined) {
      return;
    }
    const removeStrategy = removeStrategyByWallet(clientContractId.contractId, clientWallet);

    await removeStrategy(nowId);
  }

  const handlePause = async () => {
    if (!clientContractId.contractId || !clientWallet) {
      alert("Preparing, please wait!");
      return;
    }
    if (nowId === undefined) {
      return;
    }
    const updateStrategy = updateStrategyByWallet(clientContractId.contractId, clientWallet);

    await updateStrategy(nowId, { status: EStrategyStatus.PAUSED } as any);
  }

  const handleStart = async () => {
    if (!clientContractId.contractId || !clientWallet) {
      alert("Preparing, please wait!");
      return;
    }
    if (nowId === undefined) {
      return;
    }
    const updateStrategy = updateStrategyByWallet(clientContractId.contractId, clientWallet);

    await updateStrategy(nowId, { status: EStrategyStatus.ACTIVE } as any);
  }

  const canPause = useMemo(() => {
    return [
      EStrategyStatus.INIT,
      EStrategyStatus.ACTIVE,
    ].includes(status!);
  }, [status])

  const actions = (
    <div className={styles.actions}>
      {
        nowId !== undefined && (
          <>
            {canPause && <Button type="pure" schema="white" className={styles.modalBtn} size="middle" onClick={handlePause}>
              Pause Strategy
            </Button>}
            {status === EStrategyStatus.PAUSED && <Button type="pure" schema="white" className={styles.modalBtn} size="middle" onClick={handleStart}>
              Active Strategy
            </Button>}
            <Button schema="danger" className={styles.modalBtn} size="middle" onClick={handleRemove}>
              Delete
            </Button>
            <Button
              className={styles.modalBtn}
              size="middle"
              onClick={handleCreateOrUpdate}
              disabled={loading}
            >
              Update
            </Button>
          </>
        )
      }
      {
        nowId === undefined && (
          <Button 
            className={styles.modalBtn} 
            disabled={disableCreateOrUpdateBtn} 
            size="middle"
            onClick={handleCreateOrUpdate}
          >
            Create
          </Button>
        )
      }
    </div>
  )

  useEffect(() => {
    if(nowId === undefined) {
      setTargetAssets(targetAssetsDefault);
      setInvestAssets(investAssetsDefault);
      setStrategyType(strategyTypeDefault);
    } else if (nearUser.account && clientContractId.contractId) {
      setLoading(true);
      getQuanClientStrategy(nearUser.account, clientContractId.contractId!)(nowId!).then((strategy) => {
        console.log("load strategy", {strategy})
        setLoading(false);
        setTargetAssets(strategy.target_ft);
        setInvestAssets(strategy.invest_ft);
        setStrategyType(strategy.stype.toString());

        setStatus(strategy.status);

        setExpression(strategy.expression?.toString() ?? expressionDefault);
        setPrice(strategy.target_price ? from5Decimal(strategy.target_price) : 0);
        setAmount(strategy.amount ? parseFloat(formatNearAmount(strategy.amount)) : 0);

        setGridSize(strategy.grid_size ? parseFloat(formatNearAmount(strategy.grid_size)) : 0);
        setGridInterval(strategy.grid_intervel ? from5Decimal(strategy.grid_intervel) : 0);
        setHighestPrice(strategy.highest_price ? from5Decimal(strategy.highest_price) : 0);
        setLowestPrice(strategy.lowest_price ? from5Decimal(strategy.lowest_price) : 0);
      })
    }
  }, [
    nowId, 
    nearUser.account,
    clientContractId.contractId
  ])

  return (
    <Modal loading={loading} active={active} onClose={onClose} action={actions}>
      <div className={styles.createStrategyModal}>
        <div className={styles.modal__head}>
          { nowId !== undefined && <StatusTag status={status} /> }
          <h1 className={styles.title}>{
            nowId === undefined ? `Create Strategy` : `Update Strategy #${nowId}`
          }</h1>
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
                  isBuyOrSaleType(strategyType) && (
                    <>
                      <Input
                        title="Expression"
                        type="select"
                        options={expressionOptions}
                        value={expression}
                        onChange={setExpression}
                      />
                      <Input
                        title="Price (USD)"
                        type="number"
                        value={price}
                        onChange={(val) => setPrice(val ? parseFloat(val) : 0)}
                      />
                      <Input
                        title="Amount"
                        type="number"
                        options={expressionOptions}
                        value={amount}
                        onChange={(val) => setAmount(val ? parseFloat(val) : 0)}
                      />
                    </>
                  )
                }
                {
                  strategyType === "3" && (
                    <>
                      <Input
                        title="Grid Interval ($)"
                        type="number"
                        value={gridInterval}
                        onChange={(val) => setGridInterval(val ? parseFloat(val) : 0)}
                      />
                      <Input
                        title="Grid Size (Single Trade Amount)"
                        type="number"
                        value={gridSize}
                        onChange={(val) => setGridSize(val ? parseFloat(val) : 0)}
                      />
                      <Input
                        title="Highest Price"
                        type="number"
                        value={highestPrice}
                        onChange={(val) => setHighestPrice(val ? parseFloat(val) : 0)}
                      />
                      <Input
                        title="Lowest Price"
                        type="number"
                        value={lowestPrice}
                        onChange={(val) => setLowestPrice(val ? parseFloat(val) : 0)}
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

export default StrategyModal;
