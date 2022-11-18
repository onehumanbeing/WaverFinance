import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import styles from "./index.module.scss";

const AddressId: React.FC<{
  addressId: string,
  copyable?: boolean,
  className?: string,
}> = ({ addressId, copyable, className }) => {
  return (
    <div className={`${styles.addressId} ${className ?? ""}`}>
      <div className={`${styles.addressContent} addressId__content`}>
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
