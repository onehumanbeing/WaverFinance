import React, { useEffect, useState } from "react";
import { useQuanMainContract } from "../../services/near/quan-main";
import { getNearConfig } from "../../configs/near";
import { transDigital } from "../../utils/digital";
import Button from "../Button";
import Card from "../Card";

import Logo from "../Logo";
import styles from "./index.module.scss";
import { useNearUser } from "react-near";
import { transFtStringToNumber } from "../../services/near/ft";

const BalanceCardUI: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  balance?: number;
  buyUrl?: string;
}> = ({ className, style, balance, buyUrl }) => {

  return (
    <Card
      className={`${styles.balanceCard} ${className}`}
      style={style}
      background="#191814"
    >
      <div className={styles.balanceCard__info}>
        <div className={styles.logoPart}>
          <Logo/>
        </div>
        <div className={styles.balancePart}>
          <div className={styles.balancePart__value}>{
            balance === undefined ? "-" : transDigital(String(balance) ?? "0", "normal")
          }</div>
          <div className={styles.balancePart__comment}>Your $WAVER Balance</div>
        </div>
      </div>
      <div className={styles.balanceCard__action}>
        <a href={buyUrl}>
          <Button type="minimal" schema="white">Buy Now</Button>
        </a>
      </div>
    </Card>
  );
};

const BalanceCard: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  const config = getNearConfig();
  const mainContract = useQuanMainContract();
  const nearUser = useNearUser();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    if (nearUser?.isConnected && nearUser?.address) {
      mainContract?.ft_balance_of({
        account_id: nearUser?.address!,
      }).then(async (balanceStr) => {
        const balanceVal = await transFtStringToNumber(config.contractId)(balanceStr);
        setBalance(balanceVal);
      });
    }
  }, [nearUser?.isConnected, mainContract, nearUser?.address, config.contractId]);

  return (
    <BalanceCardUI 
      className={className}
      style={style} 
      balance={balance}
      buyUrl={`${config.refRinanceUrl}/swap#WAVER|NEAR`}
    />
  );
};

export default BalanceCard;

