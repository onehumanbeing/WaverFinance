import { FtContractMetadata } from "react-near/standards/ft/types";

const presetFtMetadata: {[contractId: string]: FtContractMetadata} = {
  'ft.waver.testnet': {
    spec: 'ft-1.0.0',
    name: 'Waver Finance',
    symbol: 'WAVER',
    icon: '/favicon512.png',
    decimals: 18
  },
  'ft.waver.near': {
    spec: 'ft-1.0.0',
    name: 'Waver Finance',
    symbol: 'WAVER',
    icon: '/favicon512.png',
    decimals: 18
  },
};

export const getFtMetadata = async (contractId: string) => {
  return presetFtMetadata[contractId] ?? null;
}