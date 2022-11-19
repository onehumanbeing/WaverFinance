import React from "react";
import styles from "./index.module.scss";
import NearImg from "../../assets/img/picture/near.png";

const PowerByNear: React.FC = () => {
  return (
    <div className={styles.powerByNear}>
      Powered by  <img src={NearImg.src} alt="NEAR LOGO" />
    </div>
  );
}

export default PowerByNear;
