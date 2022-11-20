import React from "react";

import DefaultNearIconImg from "../../assets/img/icons/default-near-icon.svg";
import NearCoinImg from "../../assets/img/icons/near-coin.svg";
import UsdcCoinImg from "../../assets/img/icons/usdc-coin.svg";
import UsdtCoinImg from "../../assets/img/icons/usdt-coin.svg";

import styles from "./index.module.scss";

const getImgUrl = (contractId?: string) => {
  if (!contractId) {
    return DefaultNearIconImg.src;
  }
  if (["usdt.fakes.testnet"].includes(contractId)) {
    return UsdtCoinImg.src;
  }
  if (["usdc.fakes.testnet"].includes(contractId)) {
    return UsdcCoinImg.src;
  }
  if (["wrap.testnet", "wrap.near"].includes(contractId)) {
    return NearCoinImg.src;
  }
  return DefaultNearIconImg.src;
}

const TokenIcon: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  contractId?: string,
}> = ({ className, contractId, style }) => {

  return (
    <div className={`${styles.tokenIcon} ${className ?? ""}`} style={style}>
      <img src={getImgUrl(contractId)} alt="token icon" />
    </div>
  )
}

export default TokenIcon;
