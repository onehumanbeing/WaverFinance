import React from "react";
import { IoIosNotifications } from "react-icons/io";
import styles from "./index.module.scss";

const NotificationBtn: React.FC<{
  number?: number,
}> = ({number}) => {
  return (
    <div className={styles.notificationBtn}>
      <div className={styles.notificationBtn__img}>
        <IoIosNotifications />
      </div>
      {number && <div className={styles.notificationBtn__number}>{number}</div>}
    </div>
  );
}

export default NotificationBtn;
