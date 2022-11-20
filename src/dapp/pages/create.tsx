import React, { useEffect } from "react";
import { parseNearAmount, useNearUser, useNear, useNearWallet } from "react-near";
import { useRouter } from "next/router";
import BN from 'bn.js';

import PrimaryButton from "../components/ButtonPrimary";
import Logo from "../components/Logo";

import styles from "./create.module.scss";
import Bg from "../assets/img/picture/bg.png";
import Link from "next/link";
import { useQuanMainCreateContractMutation, useQuanMainGetContractQuery } from "../services/near/quan-main";
import { trimEnd } from "../utils/string";
import { getNearConfig } from "../configs/near";
import { signTransaction, Transaction } from "near-api-js/lib/transaction";
import { NearHelper } from "../utils/nearHelper";
import { GAS_FEE } from "../constants/gasFee";

const CREATION_DEPOSIT_VAL = 2.5;
const CREATION_DEPOSIT_STR = parseNearAmount(CREATION_DEPOSIT_VAL);

const STORAGE_DEPOSIT_VAL = 0.00125;
const STORAGE_DEPOSIT_STR = parseNearAmount(STORAGE_DEPOSIT_VAL);

const CreatePage: React.FC = () => {
  const nearUser = useNearUser();
  const near = useNear();
  const wallet = useNearWallet();
  const router = useRouter();
  const config = getNearConfig();

  useEffect(() => {
    if (!nearUser.loading && !nearUser.isConnected) {
      // go to home page if not connected
      router.push("/");
      return;
    }
  })

  const getContract = useQuanMainGetContractQuery({
    variables: {
      account_id: nearUser?.address!,
    },
  })

  useEffect(() => {
    if (nearUser.isConnected && getContract.data?.length) {
      // go to home page if not connected
      router.push("/app/my-assets");
      return;
    }

  }, [nearUser.isConnected, getContract.data, router])
  
  const create = async () => {
    const trimed = trimEnd(nearUser.address!, config.namedAddressSuffix);

    const origin = window.location.origin;

    if (!near || !wallet) {
      console.error("Near of Wallet Object is null");
      return;
    }

    const helper = new NearHelper({ near, wallet });
    helper.executeMultipleTransactions([
      {
        receiverId: config.contractId,
        functionCalls: [{
          contractId: config.contractId,
          methodName: "storage_deposit",
          args: {
            account_id: nearUser.address!,
            registration_only: true,
          },
          gas: new BN(GAS_FEE[300]),
          attachedDeposit: new BN(STORAGE_DEPOSIT_STR),
        }],
      },
      {
        receiverId: config.contractId,
        functionCalls: [{
          contractId: config.contractId,
          methodName: "create_contract",
          args: {
            contract_id: trimed,
          },
          gas: new BN(GAS_FEE[300]),
          attachedDeposit: new BN(CREATION_DEPOSIT_STR),
        }],
      },
    ], `${origin}/app/my-assets`)
  }

  return (
    <div className={styles.content}>
      <Link href={"/"}>
        <a>
          <Logo className={styles.logo} /> 
        </a>
      </Link>
      <img className={styles.bg} src={Bg.src} alt="Background" /> 
      <h1> Create your trading account in one step. </h1>
      <div className={styles.bottomSection}>
        <p> * {CREATION_DEPOSIT_VAL} NEAR needed for Stake fee </p> 
        <PrimaryButton onClick={create}> Create Account </PrimaryButton>
      </div>
    </div>
  );
}

export default CreatePage;
