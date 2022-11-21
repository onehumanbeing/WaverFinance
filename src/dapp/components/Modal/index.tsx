import React from "react";
import { GrClose } from "react-icons/gr";
import CircleIconBtn from "../CircleIconBtn";
import Loading from "../Loading";

import styles from "./index.module.scss";

const Modal: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  title?: string,
  loading?: boolean,
  children: React.ReactNode,
  active: boolean,
  action?: React.ReactNode,
  onClose: () => void,
}> = ({ className, style, title, children, active, loading, action, onClose }) => {
  return (
    <div className={`${styles.modal} ${active ? styles.modal__active : ""} ${className ?? ""} ${styles.mode__greedy}`} style={style}>
      <div className={styles.modal__overlay} onClick={onClose} />
      <div className={styles.modal__content}>
        <div className={`${styles.modal__content__loading} ${loading && styles.active}`}>
          <Loading />
        </div>
        <CircleIconBtn className={styles.modal__closeBtn} icon={<GrClose />} onClick={onClose} />
        
        {title && (
          <div className={styles.modal__content__title}>
            {title}
          </div>
        )}
        <div className={styles.modal__content__body}>
          {children}
        </div>
        {action && (
          <div className={styles.modal__content__action}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
