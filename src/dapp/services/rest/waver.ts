import { getNearConfig } from "../../configs/near"
import { AccountId, FtAmountString } from "../near/common";
import { EStrategyType } from "../near/quan-client";

const config = getNearConfig();
const baseUrl = `${config.waverBackendUrl}/api`;

type IRequestOptions = RequestInit & {
  retry?: number;
}

const requestWaver = async <TData=any> (path: string, options: IRequestOptions = {}): Promise<TData> => {
  const url = `${baseUrl}${path}`;
  // TODO: add parse Query Params

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    const hasError =!response.ok || json.status;
    if (hasError) {
      throw new Error(json.msg);
    }
    return json.data as TData;
  }
  catch (err) {
    if (options.retry) {
      return requestWaver<TData>(path, { ...options, retry: options.retry - 1 });
    }
    throw err;
  }
}

export type TWaverResList<TData> = { 
  list: TData[];
}

export type TWaverRes<TData> = {
  data: TData,
  msg: string,
  status: number,
}

export type TWaverStatistic = {
  "24h": number;
  "7d": number;
  "active_strategies": number;
  "active_trading": number;
}

export type TWaverHistory = { 
  contract_id: string,
  id:number,
  price: number,
  updated: string,
}

export type TGetTokensData = {
  list: {
      contract_id: AccountId,
      ft_amount: number,
      price: number,
      token_amount: number,
    }[],
  total_token_amount: number,
}

export type TWaverActivity = {
  amount_in: FtAmountString
  amount_in_contract: AccountId,
  amount_in_decimals: number,
  amount_in_name: string,
  amount_out: FtAmountString,
  amount_out_contract: AccountId,
  amount_out_decimals: number,
  amount_out_name: string,
  contract_id: AccountId,
  failed_msg: string,
  gas_burnt: number,
  id: number,
  index: string,
  logs: string,
  price: number,
  stype: EStrategyType,
  success: boolean,
  tgas: number,
  updated: string,
}

const waverApi = {
  request: requestWaver,
  get(path: string, options: IRequestOptions = {}) {
    new URLSearchParams({
      
    }).toString();
    return requestWaver(path, { ...options, method: 'GET' });
  },
  activeContract (account_id: string) {
    return requestWaver(`/active_contract?account_id=${account_id}`, {
      // I think we should use POST method here...
      method: 'GET',
    });
  },
  activeStrategy (account_id: string, strategy_id: string) {
    return requestWaver(`/active_strategy?account_id=${account_id}&id=${strategy_id}`, {
      // I think we should use POST method here...
      method: 'GET',
    });
  },
  getRecentActivities (account_id: string): Promise<TWaverResList<TWaverActivity>> {
    return requestWaver(`/recent_activities?account_id=${account_id}`, {
      method: 'GET',
    });
  },
  getStatistics (account_id: string): Promise<TWaverRes<TWaverStatistic>> {
    return requestWaver(`/statistic?account_id=${account_id}`, {
      method: 'GET',
    });
  },
  getTokenPriceHistory (token_id: string): Promise<TWaverResList<TWaverHistory>> {
    return requestWaver(`/history_token_price?account_id=${token_id}`, {
      method: 'GET',
    }); 
  },
  // https://waver.finance/api/user/tokens?account_id=waver.testnet
  getTokens (account_id: string): Promise<TWaverRes<TGetTokensData>> {
    return requestWaver(`/user/tokens?account_id=${account_id}`, {
      method: 'GET',
    }); 
  },
}

export default waverApi;
