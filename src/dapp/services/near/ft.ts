import { useNearContract } from "react-near";
import { FtContract } from "react-near/standards/ft/types";
import { StorageContract } from "react-near/standards/storage/types";
import { FT_METHODS } from "react-near/standards/ft/config";
import { STORAGE_METHODS } from "react-near/standards/storage/config";
import { getFtMetadata } from "./metadata";


export function useFtContract(ftFunctionName: string) {
  return useNearContract<FtContract & StorageContract>(ftFunctionName, {
    viewMethods: [...FT_METHODS.viewMethods, ...STORAGE_METHODS.viewMethods],
    changeMethods: [...FT_METHODS.changeMethods, ...STORAGE_METHODS.changeMethods],
  });
}

export const transFtStringToNumber = (contractId: string) => async (ftString: string) => {
  const ftMetadata = await getFtMetadata(contractId)
  const digitalPosition = Math.pow(10, ftMetadata.decimals)
  return Number(ftString) / digitalPosition;
}

// use fixed for temp demo
const fixedFtList = [
  "wrap.testnet",
  "usdt.fakes.testnet",
  "usdc.fakes.testnet",
]



export const useFtAssetsList = (accountId: string) => {
  const ftContract = useFtContract('mfight-ft.testnet');
  // const ftAssetsList = useNearQuery('ft_balance_of', {
  //   contract: ftContract,
  //   args: {
  //     account_id: accountId,
  //   },
  // });

  return [];
}
