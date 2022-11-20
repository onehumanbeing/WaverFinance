import React from 'react';
import { useNearContract, useNearQuery, useNearMutation } from 'react-near';
import { NearMutationOptions } from 'react-near/hooks/mutation';
import { NearQueryOptions } from 'react-near/hooks/query';
import { FtContract } from "react-near/standards/ft/types";
import { StorageContract } from "react-near/standards/storage/types";
import { FT_METHODS } from "react-near/standards/ft/config";
import { STORAGE_METHODS } from "react-near/standards/storage/config";
import { getNearConfig } from '../../configs/near';
import { AccountId, FtAmountString, NearFiveDigitAmount } from './common';

export enum EQuanMainViewMethods {
  get_contract = "get_contract",
}

export enum EQuanMainChangeMethods {
  create_contract = "create_contract",  // payable

}

export interface IQuanMainContract {
  // view methods
  get_contract(args: IGetContractArgs): Promise<IGetContractResult>;
  
  // change methods
  create_contract(args: ICreateContractArgs): Promise<ICreateContractResult>;
}

export const useQuanMainContract = () => {
  const config = getNearConfig();
  return useNearContract<IQuanMainContract & FtContract & StorageContract>(config.contractId, {
    viewMethods: [
      ...FT_METHODS.viewMethods,
      ...STORAGE_METHODS.viewMethods,
      EQuanMainViewMethods.get_contract,
    ],
    changeMethods: [
      ...FT_METHODS.changeMethods,
      ...STORAGE_METHODS.changeMethods,
      EQuanMainChangeMethods.create_contract,
    ],
  })
}

export function useQuanMainContractQueryRaw<Res = any, Req extends { [key: string]: any; } = any>(
  methodName: EQuanMainViewMethods,
  opts: NearQueryOptions<Res, Req> = {}
) {
  const contract = useQuanMainContract();

  return useNearQuery(methodName, { contract, ...opts });
}

export function useQuanMainContractMutationRaw<Res = any, Req extends { [key: string]: any; } = any>(
  methodName: EQuanMainChangeMethods,
  opts: NearMutationOptions<Res, Req> = {}
) {
  const contract = useQuanMainContract();

  return useNearMutation(methodName, { contract, ...opts });
}

// get_contract query

export type IGetContractArgs = {
  account_id: AccountId,
};

export type IGetContractResult = string | null;

export function useQuanMainGetContractQuery(opts: NearQueryOptions<IGetContractResult, IGetContractArgs>) {
    return useQuanMainContractQueryRaw<IGetContractResult, IGetContractArgs>(EQuanMainViewMethods.get_contract, opts);
}

// create_contract mutation

export type ICreateContractArgs = {
  contract_id: AccountId,
};

export type ICreateContractResult = string | null;

export function useQuanMainCreateContractMutation(opts: NearMutationOptions<ICreateContractResult, ICreateContractArgs>) {
    return useQuanMainContractMutationRaw<ICreateContractResult, ICreateContractArgs>(EQuanMainChangeMethods.create_contract, opts);
}
