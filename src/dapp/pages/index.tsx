import React from "react";
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from "next/link";

import TopNavbar from "../components/LandingTopNavBar";
import PageWidthWrapper from "../components/PageWidthWrapper";
import TokenState from "../components/TokenState";
import PrimaryButton from "../components/ButtonPrimary";
import PowerByNear from "../components/PowerByNear";

import styles from './index.module.scss';

import BgImg from "../assets/img/picture/wave2.png";
import { useNearUser } from "react-near";
import { useRouter } from "next/router";


const Home: NextPage = () => {
  const nearUser = useNearUser();
  const router = useRouter()

  const clickGetStarted = async () => {
    if (!nearUser || !nearUser.isConnected) {
      const origin = window.location.origin;
      const successUrl = `${origin}/app/my-assets`;
      await nearUser.connect("Waver", successUrl);
      return;
    }
    router.push('/app/my-assets');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Waver</title>
        <meta name="description" content="The First Decentralized Quantitative Trading Platform on NEAR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PageWidthWrapper>
          <TopNavbar/>
          <div className={styles.bgBox}>
            <img src={BgImg.src} alt="bg" className={styles.bgImg} />
          </div>
          <div className={styles.content}>
            <TokenState />
            <h1> The <span>First</span> Decentralized Quantitative Trading Platform on <span>NEAR</span></h1>
            <p> Transparent, Secure, Intelligent </p> 
            {/* <Link href="/create"> */}
              <PrimaryButton onClick={clickGetStarted}> Get Started </PrimaryButton>
            {/* </Link> */}
          </div>
        </PageWidthWrapper>
      </main>

      <footer className={styles.footer}>
        <PageWidthWrapper>
          <PowerByNear />
        </PageWidthWrapper>
      </footer>
    </div>
  )
}

export default Home
