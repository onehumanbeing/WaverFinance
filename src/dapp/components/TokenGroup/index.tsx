import React from "react";
import TokenInfo from "../TokenInfo";

import styles from "./index.module.scss";

export const TokenGroup: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  leftFt?: string,
  rightFt?: string,
}> = ({className, style, leftFt, rightFt}) => {
  return (
    <div className={`${styles.strategyTokens} ${className}`} style={style}>
      <TokenInfo className={styles.strategyTokens__target_ft} contractId={leftFt} />
      <TokenInfo className={styles.strategyTokens__invest_ft} contractId={rightFt} />
    </div>
  )
}
