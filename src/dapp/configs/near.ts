import { NearEnvironment } from "react-near";

const config: {
  networkId: NearEnvironment;
  contractId: string;
} = {
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID as NearEnvironment ?? NearEnvironment.TestNet,
  contractId: process.env.NEXT_PUBLIC_MAIN_FT_CONTRACT_ID ?? 'waver.testnet',
};

interface INetworkConfig {
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
  namedAddressSuffix: string;
  waverBackendUrl: string;
  refRinanceUrl: string;
  supportTargetFt: { [contractId: string]: string };
  supportInvestFt: { [contractId: string]: string };
}

const supportTargetTestnetFt = {
  // "ft.waver.testnet": "WAVER",
  "wrap.testnet": "wNear",
}

const supportTargetMainnetFt = {
  // "ft.waver.near": "WAVER",
  "wrap.near": "wNear",
}

const supportInvestTestnetFt = {
  "usdt.fakes.testnet": "USDT.e",
  "usdc.fakes.testnet": "USDC",
}

// TODO: need fill in when upload to mainnet
const supportInvestMainnetFt = {}

const noneDict = {}

const NETWORK_CONFIG: {[key in NearEnvironment]: INetworkConfig} = {
  [NearEnvironment.TestNet]: {
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
    namedAddressSuffix: '.testnet',
    waverBackendUrl: 'https://waver.finance',
    refRinanceUrl: 'https://testnet.ref-finance.com',
    supportTargetFt: supportTargetTestnetFt,
    supportInvestFt: supportInvestTestnetFt,
  },
  [NearEnvironment.Test]: {
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
    namedAddressSuffix: '.testnet',
    waverBackendUrl: 'https://waver.finance',
    refRinanceUrl: 'https://testnet.ref-finance.com',
    supportTargetFt: supportTargetTestnetFt,
    supportInvestFt: supportInvestTestnetFt,
  },
  [NearEnvironment.MainNet]: {
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerUrl: 'https://explorer.mainnet.near.org',
    namedAddressSuffix: '.near',
    waverBackendUrl: 'https://waver.finance',
    refRinanceUrl: 'https://app.ref.finance',
    supportTargetFt: supportTargetMainnetFt,
    supportInvestFt: supportInvestMainnetFt,
  },
  [NearEnvironment.BetaNet]: {
    nodeUrl: 'https://rpc.betanet.near.org',
    walletUrl: 'https://wallet.betanet.near.org',
    helperUrl: 'https://helper.betanet.near.org',
    explorerUrl: 'https://explorer.betanet.near.org',
    namedAddressSuffix: '.betanet',
    waverBackendUrl: 'https://waver.finance',
    refRinanceUrl: 'https://betanet.ref-finance.com',
    supportTargetFt: noneDict,
    supportInvestFt: noneDict,
  },
  [NearEnvironment.Local]: {
    nodeUrl: 'http://localhost:3000',
    walletUrl: 'http://localhost:3000',
    helperUrl: 'http://localhost:3000',
    explorerUrl: 'http://localhost:3000',
    namedAddressSuffix: '.local',
    waverBackendUrl: 'https://waver.finance',
    refRinanceUrl: 'http://localhost:3000',
    supportTargetFt: noneDict,
    supportInvestFt: noneDict,
  },
};

export const getNearConfig = () => {
  const { networkId } = config;
  const networkConfig = NETWORK_CONFIG[networkId];
  return {
    ...networkConfig,
    ...config,
  }
};
