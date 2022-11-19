import React from "react";

import styles from "./index.module.scss";

const Tag = ({ children, color }: { children: React.ReactNode, color?: string }) => {
  return <div className={styles.tag} style={{ background: color }}>{children}</div>;
};

export default Tag;
