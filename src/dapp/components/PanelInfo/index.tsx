import React from "react";

import styles from "./index.module.scss";

interface IPanelElement {
  key?: string;
  title: string;
  content: React.ReactNode;
}

const PanelInfo: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  elements: IPanelElement[],
}> = ({ elements, className, style }) => {
  return (
    <div className={`${styles.panelInfo} ${className ?? ''}`} style={style}>
      {elements.map(({ title, content, key }) => (
        <div key={key ?? title} className={styles.panelInfo__element}>
          <div className={styles.panelInfo__element__title}>{title}</div>
          <div className={styles.panelInfo__element__content}>{content}</div>
        </div>
      ))}
    </div>
  );
}

export default PanelInfo;
