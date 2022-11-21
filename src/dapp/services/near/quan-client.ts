import BN from "bn.js";
import { Account, Contract, Near, WalletConnection } from "near-api-js";
import { useEffect, useState } from "react";
import { useNearContract, useNearUser, useNearQuery, useNearMutation, useNear, parseNearAmount } from "react-near";
import { NearMutationOptions } from "react-near/hooks/mutation";
import { NearQueryOptions } from "react-near/hooks/query";
import { getNearConfig } from "../../configs/near";
import { QUAN_CLIENT_STORAGE_PREFIX } from "../../constants/client";
import { GAS_FEE } from "../../constants/gasFee";
import { NearHelper } from "../../utils/nearHelper";
// create_strategy mutation

import { AccountId, FtAmountString, NearFiveDigitAmount, TimestampBySecond } from "./common";
import { useQuanMainGetContractQuery } from "./quan-main";


const STORAGE_DEPOSIT_VAL = 0.00125;
const STORAGE_DEPOSIT_STR = parseNearAmount(STORAGE_DEPOSIT_VAL);

export enum EQuanClientViewMethods {
  get_strategy_count = "get_strategy_count",
  get_strategy_list = "get_strategy_list",
  get_strategy = "get_strategy",
}

export enum EQuanClientChangeMethods {
  create_strategy = "create_strategy",
  update_strategy = "update_strategy",
  remove_strategy = "remove_strategy",
}

export type IStrategyInfo = {
  stype: EStrategyType,
  target_ft: AccountId,
  invest_ft: AccountId,
  
  status: EStrategyStatus,
  created: TimestampBySecond;

  // buy or sale
  expression: EBuySaleExpression | null,
  target_price: NearFiveDigitAmount | null,
  amount: FtAmountString | null,

  // grid
  grid_size: FtAmountString | null,
  grid_intervel: NearFiveDigitAmount | null,
  highest_price: NearFiveDigitAmount | null,
  lowest_price: NearFiveDigitAmount | null,
  time_period?: NearFiveDigitAmount | null,
}

export type IGetStrategyCountResult = number;

export type IGetStrategyListArgs = {
  from_index: number;
  limit: number;
};
export type IGetStrategyListResult = string[];

export type IGetStrategyArgs = {
  id: string;
};
export type IGetStrategyResult = IStrategyInfo;

export interface IQuanClientContract {
  // view methods
  get_strategy_count(): Promise<IGetStrategyCountResult>;
  get_strategy_list(args: IGetStrategyListArgs): Promise<IGetStrategyListResult>;
  get_strategy(args: IGetStrategyArgs): Promise<IGetStrategyResult>;
  
  // change methods
  create_strategy(args: ICreateStrategyArgs): Promise<ICreateStrategyResult>;
}

export const useClientContractId = () => {
  const nearUser = useNearUser();

  const qmGetContract = useQuanMainGetContractQuery({
    variables: {
      account_id: nearUser?.address!,
    },
  })

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [hasContract, setHasContract] = useState<boolean | null>(null);

  const config = getNearConfig();

  useEffect(() => {
    if (qmGetContract.data) {
      const prefix = qmGetContract.data;
      const hasContract = !!prefix;
      setHasContract(hasContract);
      setContractId(hasContract ? `${qmGetContract.data}` : null);
    }
  }, [config.contractId, qmGetContract.data])

  useEffect(() => {
    if (qmGetContract.error) {
      setError(qmGetContract.error);
    }
  }, [qmGetContract.error])

  useEffect(() => {
    if (qmGetContract.loading) {
      setLoading(qmGetContract.loading);
    }
  }, [qmGetContract.loading])

  return {
    loading, error, contractId, hasContract
  }
}

export const useQuanClientContract = () => {
  const { contractId } = useClientContractId();

  console.log("contractId", contractId);

  return useNearContract<IQuanClientContract>(contractId ?? "123", {
    viewMethods: [
      // EQuanClientChangeMethods.get_contract,
    ],
    changeMethods: [
      EQuanClientChangeMethods.create_strategy,
      EQuanClientChangeMethods.update_strategy,
    ],
  })
}

// export function useQuanClientContractQueryRaw<Res = any, Req extends { [key: string]: any; } = any>(
//   methodName: EQuanClientViewMethods,
//   opts: NearQueryOptions<Res, Req> = {}
// ) {
//   const contract = useQuanClientContract();

//   return useNearQuery(methodName, { contract, ...opts });
// }

export function useQuanClientContractMutationRaw<Res = any, Req extends { [key: string]: any; } = any>(
  methodName: EQuanClientChangeMethods,
  opts: NearMutationOptions<Res, Req> = {}
) {
  const contract = useQuanClientContract();

  return useNearMutation(methodName, { contract, ...opts });
}

export enum EStrategyType {
  BUY = 1,
  SALE = 2,
  GRID = 3,
}

export enum EBuySaleExpression {
  GTE = 1,
  LTE = 2,
}

export enum EStrategyStatus {
  INIT = 1,
  ACTIVE = 2,
  PAUSED = 3,
  ENDED = 9,
  FAILED = 10,
}

export type ICreateBuyStrategyArgs = {
  stype: EStrategyType.BUY,
  target_ft: AccountId,
  invest_ft: AccountId,
  amount: FtAmountString,
  expression: EBuySaleExpression,
  target_price: NearFiveDigitAmount,
};

export type ICreateSaleStrategyArgs = {
  stype: EStrategyType.SALE,
  target_ft: AccountId,
  invest_ft: AccountId,
  amount: FtAmountString,
  expression: EBuySaleExpression,
  target_price: NearFiveDigitAmount,
};

export type ICreateGridStrategyArgs = {
  stype: EStrategyType.GRID,
  target_ft: AccountId,
  invest_ft: AccountId,
  grid_size: FtAmountString,
  grid_intervel: NearFiveDigitAmount,
  highest_price: NearFiveDigitAmount,
  lowest_price: NearFiveDigitAmount,
  time_period?: NearFiveDigitAmount,
};

export type ICreateStrategyArgs = ICreateBuyStrategyArgs | ICreateSaleStrategyArgs | ICreateGridStrategyArgs;

export type ICreateStrategyResult = string | null;

export type IUpdateStrategyArgs = ICreateStrategyArgs & {
  status?: EStrategyStatus;
}

export function useQuanClientCreateStrategyMutation(opts: NearMutationOptions<ICreateStrategyResult, ICreateStrategyArgs>) {
    return useQuanClientContractMutationRaw<ICreateStrategyResult, ICreateStrategyArgs>(EQuanClientChangeMethods.create_strategy, opts);
}

// export const getClient
export const makeClientWallet = (near: Near, contractId: string) => {
  const wallet = new WalletConnection(near, `${QUAN_CLIENT_STORAGE_PREFIX}/${contractId}`);
  return wallet;
}

export const useQuanClientWallet = () => {
  const { contractId } = useClientContractId();
  const near = useNear();

  if (!near || !contractId) {
    return null;
  }

  return makeClientWallet(near, contractId);
}

export const createStrategyByWallet = (clientContractId: string, wallet: WalletConnection) =>  async (args: ICreateStrategyArgs) => {
  const near = wallet._near;
  const helper = new NearHelper({ near, wallet });
  return await helper.executeMultipleTransactions([
    {
      receiverId: args.invest_ft,
      functionCalls: [{
        contractId: args.invest_ft,
        methodName: "storage_deposit",
        args: {
          account_id: clientContractId!,
          registration_only: true,
        },
        gas: new BN(GAS_FEE[300]),
        attachedDeposit: new BN(STORAGE_DEPOSIT_STR),
      }],
    },
    {
      receiverId: args.target_ft,
      functionCalls: [{
        contractId: args.target_ft,
        methodName: "storage_deposit",
        args: {
          account_id: clientContractId!,
          registration_only: true,
        },
        gas: new BN(GAS_FEE[300]),
        attachedDeposit: new BN(STORAGE_DEPOSIT_STR),
      }],
    },
    {
      receiverId: clientContractId,
      functionCalls: [{
        contractId: clientContractId,
        methodName: EQuanClientChangeMethods.create_strategy,
        args: { data: args },
        gas: new BN(GAS_FEE[300]),
      }],
    },
  ])
}

export const updateStrategyByWallet = (clientContractId: string, wallet: WalletConnection) =>  async (strategyId: string, args: IUpdateStrategyArgs) => {
  const near = wallet._near;
  const helper = new NearHelper({ near, wallet });
  return await helper.executeMultipleTransactions([
    {
      receiverId: clientContractId,
      functionCalls: [{
        contractId: clientContractId,
        methodName: EQuanClientChangeMethods.update_strategy,
        args: { strategy_id: strategyId, data: args },
        gas: new BN(GAS_FEE[300]),
      }],
    },
  ])
}

export const removeStrategyByWallet = (clientContractId: string, wallet: WalletConnection) =>  async (strategyId: string) => {
  const near = wallet._near;
  const helper = new NearHelper({ near, wallet });
  return await helper.executeMultipleTransactions([
    {
      receiverId: clientContractId,
      functionCalls: [{
        contractId: clientContractId,
        methodName: EQuanClientChangeMethods.remove_strategy,
        args: { id: strategyId },
        gas: new BN(GAS_FEE[300]),
      }],
    },
  ])
}

export const useStrategyInfo = () => {
  const { contractId } = useClientContractId();
  const wallet = useQuanClientWallet();

  if (!contractId || !wallet) {
    return null;
  }

  return createStrategyByWallet(contractId, wallet);
}

export const getQuanClientStrategy = (account: Account, clientContractId: string) => async (strategyId: string): Promise<IGetStrategyResult> => {
  const result = await account.viewFunction(clientContractId, EQuanClientViewMethods.get_strategy, { id: strategyId });
  return result;
}

export const getQuanClientStrategyList = (account: Account, clientContractId: string) => async (limit = 20, from_index = 0): Promise<IGetStrategyListResult> => {
  const result = await account.viewFunction(clientContractId, EQuanClientViewMethods.get_strategy_list, { limit, from_index });
  return result;
}
