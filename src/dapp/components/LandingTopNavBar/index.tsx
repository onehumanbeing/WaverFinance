import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsGithub } from 'react-icons/bs'

import Sidebar from '../LandingSideBar'

import styles from './index.module.scss'

import BurgerIcon from '../../assets/svg/BurgerIcon'
import Discord from '../../assets/img/picture/discord.png'
import Twitter from '../../assets/img/picture/twitter.png'
import PageWidthWrapper from '../PageWidthWrapper'
import Logo from '../Logo'
import UserInfo from '../UserInfo'

export default function TopNavbar() {
  const [isSidebarOpen, toggleSidebar] = useState(false)

  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.topNav}>
        <PageWidthWrapper className={styles.inner}>
          <Link href="/">
            <a className={styles.logo}>
              <Logo />
              <h1> Waver </h1>
            </a>
          </Link>
          <div
            className={styles.sideBarBtn}
            onClick={() => toggleSidebar(!isSidebarOpen)}
          >
            <BurgerIcon />
          </div>
          <ul className={styles.ulWrapper}>
            <li>
              <Link href="/">
                <a className={styles.active}>Overview</a>
              </Link>
            </li>
            <li>
              <a href="#howItWorks" rel="noreferrer">
                How it works
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://github.com/onehumanbeing/WaverFinance/graphs/contributors"
                rel="noreferrer"
              >
                Whitepaper
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://github.com/onehumanbeing/WaverFinance"
                rel="noreferrer"
              >
                Developer
              </a>
            </li>
          </ul>
          <div className={styles.rightPart}>
            <ul className={`${styles.ulWrapper} ${styles.active}`}>
              {/* <li>
                  <a><Image src={Discord} alt="discord" width={22} height={18} /></a>						
              </li> */}
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={styles.githubIcon}
                  title="Github"
                  href="https://github.com/onehumanbeing/WaverFinance"
                >
                  <BsGithub />
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter"
                  href="https://twitter.com/WaverFinance"
                >
                  <Image src={Twitter} alt="twitter" width={22} height={18} />
                </a>
              </li>
            </ul>
            <UserInfo className={styles.userInfo} hideTitle />
          </div>
        </PageWidthWrapper>
      </div>
    </>
  )
}
