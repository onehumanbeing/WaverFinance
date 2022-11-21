import React from "react";

import styles from "./index.module.scss";

const DemoMode: React.FC<{
  className?: string,
}> = ({ className }) => {
  return (
    <div className={`${styles.demoMode} ${className}`}>
      <div className={styles.demoMode__overlay} />
      <div className={styles.demoMode__content}>
        <div className={styles.demoMode__title}>
          DEMO MODE
        </div>
        <div className={styles.demoMode__description}>
          Your data is not enough.<br />Here is a DEMO chart for you.
        </div>
      </div>
    </div>
  )
}

export default DemoMode
