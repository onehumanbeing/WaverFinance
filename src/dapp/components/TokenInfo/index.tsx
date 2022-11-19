import React from "react";
import AddressId from "../AddressId";
import TokenIcon from "../TokenIcon";

import styles from "./index.module.scss";

const TokenInfo: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  contractId: string,
  showName?: boolean,
  showAddress?: boolean,
}> = ({ className, contractId, showName, showAddress, style }) => {
  return (
    <div className={`${styles.tokenInfo} ${className ?? ""}`} style={style}>
      <TokenIcon contractId={contractId} />
      {(showName || showAddress) && (<div className={styles.tokenInfo__info}>
        {showName && (
          <div className={styles.tokenInfo__info__name}>NEAR</div>
        )}
        <div className={styles.tokenInfo__info__address}>
          {showAddress && (
            <AddressId addressId={contractId} />
          )}
        </div>
      </div>)}
    </div>
  )
}

export default TokenInfo;
