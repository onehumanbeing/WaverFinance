import React from "react";

import DefaultNearIconImg from "../../assets/img/icons/default-near-icon.svg";

import styles from "./index.module.scss";

const TokenIcon: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  contractId?: string,
}> = ({ className, contractId, style }) => {
  return (
    <div className={`${styles.tokenIcon} ${className ?? ""}`} style={style}>
      <img src={DefaultNearIconImg.src} alt="token icon" />
    </div>
  )
}

export default TokenIcon;
