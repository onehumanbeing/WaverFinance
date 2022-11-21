import React from "react";

import styles from "./index.module.scss";

const Loading: React.FC<{
  className?: string,
  style?: React.CSSProperties,
}> = ({ className, style }) => {
  return (
    <div className={`${styles.loading} ${className ?? ""}`}>
      <div className={`${styles.ldsRipple}`} style={style}>
        <div></div><div></div>
      </div>
      <div className={`${styles.text}`}>Loading</div>
    </div>
  )
}

export default Loading;
