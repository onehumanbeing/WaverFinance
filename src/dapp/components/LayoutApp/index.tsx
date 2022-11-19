import React from 'react';
import AppTopNavBar from '../AppTopNavBar';
import styles from './index.module.scss';
import AppSideBar from '../AppSideBar/index';

const LayoutApp: React.FC<{
  children: React.ReactNode,
}> = ({ children }) => {
  return (
    <div className={styles.layoutApp}>
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <AppTopNavBar className={styles.navBar} />
          { children }  
        </div>
      </div>
      <div className={styles.sideBar}>
        <div className={styles.wrapper}>
          <AppSideBar />
        </div>
      </div>
    </div>
  )
}

export default LayoutApp;
