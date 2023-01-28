import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Logo from '../Logo'

import styles from './index.module.scss'

const AppTopNavBar: React.FC<{
  className?: string
}> = ({ className }) => {
  const menuList = [
    { title: 'My Assets', link: '/app/my-assets' },
    { title: 'My Strategy', link: '/app/my-strategy' },
    { title: 'Copy Trading', link: 'javascript:;' },
  ]

  const router = useRouter()

  return (
    <div className={`${styles.appTopNavBar} ${className}`}>
      <div className={styles.appTopNavBar__logo}>
        <Link href="/">
          <a>
            <Logo className={styles.appTopNavBar__logo__img} />
          </a>
        </Link>
      </div>
      <ul className={styles.appTopNavBar__navList}>
        {menuList.map(({ title, link }, index) => {
          const isHere = router.pathname.startsWith(link)
          if (title === 'Copy Trading') {
            return (
              <li
                className={`${styles.nav} ${isHere && styles.active}`}
                key={index}
              >
                <Link href={link}>
                  <a className={styles.title}>
                    <div className={styles.comingSoon}>
                      <span>{title}</span>
                      <span className={styles.comingSoon__second}>
                        coming soon
                      </span>
                    </div>
                  </a>
                </Link>
              </li>
            )
          }
          return (
            <li
              className={`${styles.nav} ${isHere && styles.active}`}
              key={index}
            >
              <Link href={link}>
                <a className={styles.title}>{title}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AppTopNavBar
