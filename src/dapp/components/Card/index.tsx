import React from "react";

import styles from "./index.module.scss";

const defaultBgColor = "#11100e";

const Card: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode,
  background?: string,
  title?: string,
  extra?: React.ReactNode,
}> = ({ 
  children, 
  className, 
  style,
  title, 
  extra,
  background=defaultBgColor,
}) => {
  return (
    <div className={`${styles.card} ${className ?? ''}`} style={{
      ...style,
      background,
    }}>
      { (title || extra) && (
        <div className={styles.card__header}>
          <div className={styles.card__header__title}>{title}</div>
          <div className={styles.card__header__extra}>{extra}</div>
        </div>
      ) }
      { children }
    </div>
  )
}

export default Card;
