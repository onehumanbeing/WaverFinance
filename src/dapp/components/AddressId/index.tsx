import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import styles from "./index.module.scss";

const AddressId: React.FC<{
  addressId: string,
  copyable?: boolean,
  className?: string,
  toExplorer?: boolean,
}> = ({ addressId, copyable, className, toExplorer }) => {
  const goToExplorer = () => {
    window.open(`https://explorer.testnet.near.org/accounts/${addressId}`, "_blank");
  }

  return (
    <div className={`${styles.addressId} ${className ?? ""}`}>
      <div className={`${styles.addressContent} addressId__content ${toExplorer && styles.clickable}`} onClick={toExplorer ? goToExplorer : undefined}>
        {addressId}
      </div>
      {copyable && (
        <div 
          className={styles.copyBtn} 
          onClick={() => navigator.clipboard.writeText(addressId)}
        >
          <IoCopyOutline />
        </div>
      )}
    </div>
  );
}

export default AddressId;
