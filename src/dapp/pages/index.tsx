import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import Image from 'next/image'
import { BsGithub } from 'react-icons/bs'
import Twitter from '../assets/img/picture/twitter.png'
import Logo from '../components/Logo'

import TopNavbar from '../components/LandingTopNavBar'
import PageWidthWrapper from '../components/PageWidthWrapper'
import TokenState from '../components/TokenState'
import PrimaryButton from '../components/ButtonPrimary'
import PowerByNear from '../components/PowerByNear'

import styles from './index.module.scss'

import BgImg from '../assets/img/picture/wave2.png'
import ChartsImg from '../assets/img/picture/charts.png'
import UsdcImg from '../assets/img/picture/usdc.png'
import NearCoinImg from '../assets/img/picture/near_coin.png'
import Picture1Img from '../assets/img/picture/Picture1.png'
import { useNearUser } from 'react-near'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const nearUser = useNearUser()
  const router = useRouter()

  const clickGetStarted = async () => {
    if (!nearUser || !nearUser.isConnected) {
      const origin = window.location.origin
      const successUrl = `${origin}/app/my-assets`
      await nearUser.connect('Waver', successUrl)
      return
    }
    router.push('/app/my-assets')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Waver</title>
        <meta
          name="description"
          content="The First Decentralized Social Trading Platform on NEAR"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* home page one */}
      <main className={styles.main}>
        <div className={styles.bgBox}>
          <img src={BgImg.src} alt="bg" className={styles.bgImg} />
        </div>
        <PageWidthWrapper>
          <TopNavbar />
          {/* <div className={styles.bgBox}>
            <img src={BgImg.src} alt="bg" className={styles.bgImg} />
          </div> */}
          <div className={styles.content}>
            <TokenState />
            <h1>
              {' '}
              The <span>First</span> Decentralized Social Trading Platform on{' '}
              <span>NEAR</span>
            </h1>
            <p> Transparent, Secure, Intelligent </p>
            {/* <Link href="/create"> */}
            <PrimaryButton onClick={clickGetStarted}>
              {' '}
              Get Started{' '}
            </PrimaryButton>
            {/* </Link> */}
          </div>
        </PageWidthWrapper>
        <footer className={styles.firstFooter}>
          <PageWidthWrapper>
            <PowerByNear />
          </PageWidthWrapper>
        </footer>
      </main>
      {/* home page two */}
      <main id="howItWorks">
        <PageWidthWrapper>
          <div className={styles.content2}>
            <div className={styles.title}>
              <h2>
                What is <span>Copy Trading ?</span>
              </h2>
            </div>
            <div className={styles.otherStyle}>
              <div className={styles.zhengfangxing}></div>
              <p>
                {
                  'Copy trading is a type of trading in which a trader (Subscriber) mirrors the trades of another trader (Strategist). This allows the follower to '
                }
                <span>benefit</span>
                from the knowledge and experience of the strategy provider{' '}
                <span>
                  without having to do the research and analysis themselves
                </span>
              </p>
              <p>
                In <span>Waver</span>
                {
                  ", when you subscribe to a strategist, your account is automatically synced to the strategist's account, and all trades made by the strategist are replicated in the your's."
                }
              </p>
              <div className={styles.zuoxiajiao}></div>
            </div>
            <img
              src={ChartsImg.src}
              alt="charts"
              className={styles.chartsImg}
            />
          </div>
        </PageWidthWrapper>
      </main>
      {/* home page three */}
      <main>
        <PageWidthWrapper>
          <div className={styles.content2}>
            <div className={styles.title}>
              <h2>
                Not sure <span>where to start ?</span>
              </h2>
            </div>
            <div className={styles.content2_content}>
              <div className={styles.left}>
                <div className={styles.box1}>
                  <h3>{"I'm a Beginner"}</h3>
                  <img
                    src={UsdcImg.src}
                    alt="usdc"
                    className={styles.usdcImg}
                  />
                </div>
                <div className={styles.box2}>
                  <p>
                    Subscribe to a professional strategist and copy the trades
                    24/7. Free for 30 days. Cancel at any time.
                    <span>Find a strategist</span>
                  </p>
                  <div className={styles.box2_right}>-</div>
                </div>
                <div className={styles.box2}>
                  <p>
                    Purchase a profiting strategy from our community marketplace
                    and use it or alter it whenever you want.
                    <span>Find a strategy</span>
                  </p>
                  <div className={styles.box2_right}>-</div>
                </div>
              </div>
              <div className={styles.center}></div>
              <div className={styles.right}>
                <div className={styles.box1}>
                  <h3>{"I'm a Strategist"}</h3>
                  <img
                    src={NearCoinImg.src}
                    alt="near_coin"
                    className={styles.nearCoinImg}
                  />
                </div>
                <div className={styles.box3}>
                  <div className={styles.box3_left}>-</div>
                  <p>
                    Make your first trading strategy on Waver <span>here</span>,
                    and run it for at least 7 days.
                  </p>
                </div>
                <div className={styles.box3}>
                  <div className={styles.box3_left}>-</div>
                  <p>
                    Publish your strategy to our{' '}
                    <span>community marketplace</span> to gain money.
                  </p>
                </div>
                <div className={styles.box3}>
                  <div className={styles.box3_left}>-</div>
                  <p>
                    Certify as a <span>Pro Strategist</span> and gain
                    subscribers in the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageWidthWrapper>
      </main>
      {/* home page four */}
      <main>
        <PageWidthWrapper>
          <div className={styles.content4}>
            <h2>Roadmap</h2>
            <div className={styles.imgBox}>
              <img
                src={Picture1Img.src}
                alt="picture1"
                className={styles.picture1Img}
              />
              <div className={styles.text1}>
                <div className={styles.text_title}>
                  2023 <span>Q1</span>
                </div>
                <div> - Raise seed funding</div>
                <div> - Worldwide marketing and brand awareness</div>
              </div>
              <div className={styles.text2}>
                <div className={styles.text_title}>
                  2023 <span>Q2</span>
                </div>
                <div>Open testnet demo</div>
              </div>
              <div className={styles.text3}>
                <div className={styles.text_title}>
                  2023 <span>Q3</span>
                </div>
                <div> - Launch mainnet</div>
                <div> - Public IDO</div>
                <div> - Leveraged Yield farming</div>
                <div> - DEX, CEX listing</div>
              </div>
              <div className={styles.text4}>
                <div className={styles.text_title}>
                  2023 <span>Q4</span>
                </div>
                <div> - DAO governance</div>
                <div> - Magnified leverage</div>
                <div> - Interchain implementation</div>
              </div>
            </div>
          </div>
        </PageWidthWrapper>
      </main>
      <footer className={styles.footer}>
        <PageWidthWrapper className={styles.inner}>
          <Link href="/">
            <a className={styles.logo}>
              <Logo />
              <h1> Waver </h1>
            </a>
          </Link>
          <div className={styles.rightPart}>
            <ul className={`${styles.ulWrapper} ${styles.active}`}>
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
                  className={styles.twitterIcon}
                  title="Twitter"
                  href="https://twitter.com/WaverFinance"
                >
                  <Image src={Twitter} alt="twitter" width={22} height={18} />
                </a>
              </li>
            </ul>
          </div>
        </PageWidthWrapper>
      </footer>
    </div>
  )
}

export default Home
