import React from "react";

import styles from "./index.module.scss";

const CircleIconBtn: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  icon: React.ReactNode,
  onClick: () => void,
}> = ({ className, style, icon, onClick }) => {
  return (
    <div
      className={`${styles.circleIconBtn} ${className ?? ""}`}
      style={style}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}

export default CircleIconBtn;
