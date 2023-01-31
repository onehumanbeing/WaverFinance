import Link from 'next/link'
import React from 'react'

import styles from './index.module.scss'
import CloseIcon from '../../assets/svg/CloseIcon'
import Backdrop from '../Backdrop'

const Sidebar: React.FC<{
  isSidebarOpen: boolean
  toggleSidebar: (status: boolean) => void
}> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      <div
        className={`${styles.sideNav} ${isSidebarOpen ? styles.active : ''}`}
      >
        <div className={styles.header}>
          <div className="flexNullCenter"></div>
          <button
            className={styles.closeBtn}
            onClick={() => toggleSidebar(!isSidebarOpen)}
            title="close"
          >
            <CloseIcon />
          </button>
        </div>
        <ul className={styles.ul}>
          <li className={styles.active}>
            <Link href="/">Overview</Link>
          </li>
          <li>
            <a href="#howItWorks" rel="noreferrer">
              How it works
            </a>
          </li>
          <li>
            <a>Whitepaper</a>
          </li>
          <li>
            <a>Developer</a>
          </li>
        </ul>
      </div>
      {isSidebarOpen && <Backdrop onClick={() => toggleSidebar(false)} />}
    </>
  )
}

export default Sidebar
