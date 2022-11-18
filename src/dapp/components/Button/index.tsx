import React from "react";
import styles from "./index.module.scss";

const Button: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
  type?: "primary" | "minimal" | "pure";
  schema?: "default" | "danger" | "white" | "colorful" | "transparent";
  size?: "middle";
}> = ({
  children,
  className,
  onClick,
  style,
  disabled,
  loading,
  size,
  type = "primary",
  schema = "default",
}) => {
  return (
    <button
      className={`${styles.button} ${className ?? ""} ${
        styles[`button__type-${type}`]
      } ${
        styles[`button__schema-${schema}`]
      } ${
        styles[`button__size-${size}`]
      }`}
      onClick={(e) => !disabled && onClick?.(e)}
      style={style}
      disabled={disabled}
    >
      {children}
      {loading && (
        <div className={styles.loading}>
          <span className={styles.loader}></span>
        </div>
      )}
    </button>
  );
};

export default Button;
