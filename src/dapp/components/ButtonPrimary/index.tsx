import React from "react";
import styles from "./index.module.scss";

const PrimaryButton: React.FC<{
  className?: string,
  children: React.ReactNode,
  onClick?: () => void,
}> = ({ className, children, onClick }) => {
  return (
    <button className={`${styles.primaryBtn} ${className}`} onClick={onClick}>
      { children }
    </button>
  )
}

export default PrimaryButton;
