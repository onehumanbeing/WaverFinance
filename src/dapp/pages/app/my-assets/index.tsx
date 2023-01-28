import { NextPage } from 'next'
import React, { useEffect } from 'react'
import { RiWalletLine } from 'react-icons/ri'
import { GoSettings } from 'react-icons/go'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { useNearUser, useNear } from 'react-near'

import LayoutApp from '../../../components/LayoutApp'
import Card from '../../../components/Card'
import PanelInfo from '../../../components/PanelInfo'
import TrendDigital from '../../../components/TrendDigital'
import AddressId from '../../../components/AddressId'
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import TokenInfo from '../../../components/TokenInfo'
import TokenAmount from '../../../components/TokenAmount'

import StorageIcon from '../../../assets/img/icons/storage.svg'

import styles from './index.module.scss'
import { useRouter } from 'next/router'
import {
  useQuanMainContract,
  useQuanMainGetContractQuery,
} from '../../../services/near/quan-main'
import Head from 'next/head'
import {
  EStrategyType,
  useClientContractId,
  useQuanClientWallet,
  useWithdrawNear,
  withdraw,
} from '../../../services/near/quan-client'
import {
  useAccountNearStatus as useAccountNearStatus,
  useClientTokens,
  useHistoryActivities,
  useWaverStatistic,
} from '../../../hooks/waver'
import waverApi, { TWaverActivity } from '../../../services/rest/waver'
import { TokenGroup } from '../../../components/TokenGroup'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import { NearHelper } from '../../../utils/nearHelper'

const BalanceCardPart: React.FC<{
  className: string
  icon: React.ReactNode
  title: React.ReactNode
  value: React.ReactNode
  extra?: React.ReactNode
}> = ({ className, icon, title, value, extra }) => {
  const nearUser = useNearUser()
  const router = useRouter()
  const qmGetContract = useQuanMainGetContractQuery({
    variables: {
      account_id: nearUser?.address!,
    },
  })

  useEffect(() => {
    if (!nearUser?.loading && (!nearUser.address || !nearUser.isConnected)) {
      router.push('/')
      return
    }

    if (
      !qmGetContract.loading &&
      !qmGetContract.error &&
      !qmGetContract.data?.length
    ) {
      router.push('/create')
      return
    }
  }, [
    nearUser,
    nearUser?.address,
    nearUser?.isConnected,
    nearUser?.loading,
    router,
    qmGetContract?.data,
    qmGetContract?.error,
    qmGetContract?.loading,
  ])

  return (
    <div className={`${styles.part} ${className ?? ''}`}>
      <div className={styles.iconBox}>
        <div className={styles.iconBox__icon}>{icon}</div>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
    </div>
  )
}

const MyAssetsPage: NextPage = () => {
  const { contractId } = useClientContractId()
  const near = useNear()
  const nearUser = useNearUser()
  const wallet = useQuanClientWallet()
  const { activities } = useHistoryActivities()

  useEffect(() => {
    if (nearUser.address) {
      waverApi.activeContract(nearUser.address)
    }
  }, [nearUser.address])

  const { data: statistic } = useWaverStatistic()
  const { data: tokensInfo, loading: tokensLoading } = useClientTokens()
  const { data: nearInfo } = useAccountNearStatus(contractId!)
  const { withdrawNear } = useWithdrawNear()

  const handleWithdrawNear = async () => {
    const amountStr = prompt(
      'Please input the amount of NEAR you want to withdraw'
    )
    if (!amountStr) {
      return
    }
    const amount = parseFloat(amountStr)

    if (!nearInfo?.amount || !contractId || !withdrawNear) {
      alert('Main account is loading')
      return
    }
    if (!amount || amount <= 0) {
      alert('Please input valid amount!')
      return
    }
    const balance = parseFloat(formatNearAmount(nearInfo?.amount))
    if (balance <= 0 || amount > balance) {
      alert("You don't have enough balance!")
      return
    }

    const amountNearStr = parseNearAmount(amount.toString())
    await withdrawNear(amountNearStr!)
  }

  const total_gas =
    activities?.reduce((prev, activity) => prev + activity.gas_burnt, 0) ?? 0

  return (
    <LayoutApp>
      <Head>
        <title>My Assets - Waver</title>
        <meta
          name="description"
          content="The First Decentralized Social Trading Platform on NEAR"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.myAssetsPage__container}>
        <div className={styles.contractInfo}>
          <div className={styles.leftPart}>
            <Card
              className={styles.balanceCard}
              background="linear-gradient(307deg, #08036d 0%, #000796 43%, #5230e4 100%)"
            >
              <BalanceCardPart
                className={styles.balancePart}
                title="Available Balance"
                icon={<RiWalletLine />}
                value={
                  <TrendDigital
                    digital={tokensInfo?.total_token_amount}
                    prefix="$ "
                  />
                }
                extra={<TrendDigital digital={10} suffix="%" trend="up" />}
              />
              <BalanceCardPart
                className={styles.depositAmountPart}
                title="Deposit Amount"
                icon={
                  <img
                    className={styles.icon}
                    src={StorageIcon.src}
                    alt="storage icon"
                  />
                }
                value={
                  <TrendDigital
                    digital={
                      nearInfo?.amount ? formatNearAmount(nearInfo.amount) : '-'
                    }
                    suffix=" Ⓝ"
                  />
                }
                extra={
                  <Button
                    className={styles.withdrawBtn}
                    type="minimal"
                    schema="white"
                    onClick={handleWithdrawNear}
                  >
                    Withdraw
                  </Button>
                }
              />
            </Card>
            <Card title="Smart Contract" className={styles.contractInfoCard}>
              <AddressId
                className={styles.contractInfoCard__address}
                addressId={contractId ?? ''}
                copyable
                toExplorer
              />
              <div className={styles.version}>Version 1.0.0</div>
            </Card>
          </div>
          <div className={styles.rightPart}>
            <PanelInfo
              className={styles.panelInfo}
              elements={[
                {
                  title: '24h Transactions',
                  content: (
                    <TrendDigital
                      digital={statistic?.['24h'] ?? '-'}
                      prefix="$ "
                    />
                  ),
                },
                {
                  title: '7d Transactions',
                  content: (
                    <TrendDigital
                      digital={statistic?.['7d'] ?? '-'}
                      prefix="$ "
                    />
                  ),
                },
                {
                  title: 'Active Trading',
                  content: statistic?.active_trading ?? '-',
                },
                {
                  title: 'Active Strategy',
                  content: statistic?.active_strategies ?? '-',
                },
                {
                  title: 'Gas Burnt (NEAR)',
                  content: total_gas ? total_gas?.toFixed(5) : '-',
                },
              ]}
            />
            <Card
              className={styles.tokensCard}
              title="Tokens"
              extra={<GoSettings />}
            >
              <Table
                className={styles.tokensTable}
                columns={[
                  {
                    title: 'Assets',
                    dataIndex: 'contract_id',
                    render: (contractId: string) => (
                      <TokenInfo contractId={contractId} showName showAddress />
                    ),
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'contract_id',
                    render: (
                      contractId: string,
                      { ft_amount, token_amount }
                    ) => (
                      <div className={styles.amount}>
                        <div className={styles.amountBalance}>
                          {/* <TokenAmount contractId={contractId} amount={ft_amount} /> */}
                          {ft_amount.toFixed(2)}
                        </div>
                        <div className={styles.amountUsd}>
                          ≈ $
                          {
                            /*<TokenAmount contractId={contractId} amount={token_amount} usdMode />*/
                            token_amount.toFixed(2)
                          }
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Action',
                    dataIndex: 'contract_id',
                    render: (ftContractId: string, { ft_amount, decimals }) => {
                      const handleWithdrawFt = async () => {
                        if (
                          !nearInfo?.amount ||
                          !contractId ||
                          !withdrawNear ||
                          !nearUser?.address ||
                          !near ||
                          !wallet
                        ) {
                          alert('Main account is loading')
                          return
                        }

                        // check if deposit
                        // const helper = new NearHelper({ near, wallet });
                        // // const deposited = await helper.nearViewFunction({
                        // //   methodName: 'ft_balance_of',
                        // //   contractName: ftContractId,
                        // //   args: {
                        // //     account_id: nearUser.address,
                        // //   },
                        // // })
                        // // const hasDeposit = deposited && deposited.total === '0';
                        // // if (!hasDeposit) {
                        // //   alert(`You need to deposit "${ftContractId}" first!`)
                        // //   return await helper.executeMultipleTransactions([
                        // //     {
                        // //       receiverId: ftContractId,
                        // //       functionCalls: [
                        // //         {
                        // //           contractId: ftContractId,
                        // //           methodName: "storage_deposit",
                        // //           args: {
                        // //             account_id: clientContractId!,
                        // //             registration_only: true,
                        // //           },
                        // //           gas: new BN(GAS_FEE[300]),
                        // //           attachedDeposit: new BN(STORAGE_DEPOSIT_STR),
                        // //         },
                        // //       ],
                        // //     },
                        // //   ])
                        // // }

                        const amountStr = prompt(
                          'Please input the amount of NEAR you want to withdraw'
                        )
                        if (!amountStr) {
                          return
                        }
                        const amount = parseFloat(amountStr)

                        if (!amount || amount <= 0) {
                          alert('Please input valid amount!')
                          return
                        }
                        const balance = ft_amount
                        if (balance <= 0 || amount > balance) {
                          alert("You don't have enough balance!")
                          return
                        }

                        const amountNearStr = Math.floor(
                          amount * 10 ** decimals
                        ).toLocaleString('fullwide', { useGrouping: false })
                        await withdraw(
                          contractId,
                          nearUser.address,
                          wallet!
                        )(ftContractId, amountNearStr!)
                      }

                      return (
                        <div className={styles.tokensTable__action}>
                          <Button
                            type="pure"
                            onClick={() =>
                              alert(
                                `Please transfer to address '${contractId}' to add the token you want!`
                              )
                            }
                          >
                            Add
                          </Button>
                          <Button type="pure" onClick={handleWithdrawFt}>
                            Withdraw
                          </Button>
                        </div>
                      )
                    },
                  },
                ]}
                dataSource={
                  tokensInfo?.list.map((token) => ({
                    ...token,
                    key: token.contract_id,
                  })) ?? []
                }
                loading={tokensLoading}
              />
            </Card>
          </div>
        </div>
        <Card className={styles.recentActivityCard} title="Recent Activity">
          {
            <Table
              className={styles.activityTable}
              columns={[
                {
                  title: 'Assets',
                  dataIndex: '',
                  render: (
                    _: string,
                    { amount_in_contract, amount_out_contract }: TWaverActivity
                  ) => (
                    <TokenGroup
                      leftFt={amount_in_contract}
                      rightFt={amount_out_contract}
                    />
                    // <TokenInfo contractId={contractId} showName />
                  ),
                },
                {
                  title: 'Status',
                  dataIndex: 'success',
                  render: (success: boolean) => {
                    const getMsg = () => {
                      if (success) {
                        return <AiOutlineCheckCircle />
                      } else {
                        return <AiOutlineCloseCircle />
                      }
                    }
                    return (
                      <div className={styles.activityTable__status}>
                        {getMsg()}
                      </div>
                    )
                  },
                },
                {
                  title: 'Action',
                  dataIndex: 'stype',
                  render: (stype: EStrategyType) => {
                    const getAction = () => {
                      if (stype === EStrategyType.BUY) {
                        return 'Buy'
                      }
                      if (stype === EStrategyType.SALE) {
                        return 'Sale'
                      }
                      if (stype === EStrategyType.GRID) {
                        return 'Grid'
                      }
                      return 'Unknown'
                    }
                    return (
                      <div className={styles.activityTable__action}>
                        {getAction()}
                      </div>
                    )
                  },
                },
                {
                  title: 'Origin',
                  dataIndex: 'id',
                  render: (id: number) => (
                    <div className={styles.activityTable__type}>
                      Stragegy #{id}
                    </div>
                  ),
                },
                {
                  title: 'Amount In',
                  dataIndex: 'amount_in_contract',
                  render: (
                    contractId: string,
                    { amount_in, amount_in_decimals }: TWaverActivity
                  ) => (
                    <div className={styles.activityTable__amountIn}>
                      <TokenAmount
                        contractId={contractId}
                        amount={amount_in}
                        dicimal={amount_in_decimals}
                        mode="amountStr"
                        withUnit
                      />
                    </div>
                  ),
                },
                {
                  title: 'Amount Out',
                  dataIndex: 'amount_out_contract',
                  render: (
                    contractId: string,
                    { amount_out, amount_out_decimals }: TWaverActivity
                  ) => (
                    <div className={styles.activityTable__amountOut}>
                      <TokenAmount
                        contractId={contractId}
                        amount={amount_out}
                        dicimal={amount_out_decimals}
                        mode="amountStr"
                        withUnit
                      />
                    </div>
                  ),
                },
                {
                  title: 'Created At',
                  dataIndex: 'updated',
                  render: (updated: string) => (
                    <div className={styles.activityTable__amountOut}>
                      {new Date(updated).toLocaleString()}
                    </div>
                  ),
                },
              ]}
              dataSource={activities ?? []}
              // onClickRow={(record: TWaverActivity) => {
              //   window.open(`https://explorer.testnet.near.org/transactions/${record.transaction_id}`, '_blank');
              // }}
              loading={!activities}
            />
          }
        </Card>
      </div>
    </LayoutApp>
  )
}

export default MyAssetsPage
