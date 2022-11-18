import React from "react";
import styles from "./index.module.scss";

const Backdrop: React.FC<{
  onClick: () => void
}> = ({ onClick }) => {
  return <div className={styles.backDrop} onClick={onClick}></div>;
}

export default Backdrop;

