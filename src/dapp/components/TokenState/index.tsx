import React from "react";
import Image from 'next/image';

import styles from "./index.module.scss";
import Logo from "../../assets/img/logo/logo.png";


const TokenState: React.FC = () => {
  return (
    <div id='tokenState' className={styles.tokenState}>
      <div id='tokenImgBox' className={styles.tokenImgBox}>
        <Image src={Logo} width={15} height={15} alt="Waver" />
      </div>
      $1.52
    </div>
  );
}

export default TokenState;
