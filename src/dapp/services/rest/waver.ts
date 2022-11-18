import { getNearConfig } from "../../configs/near"

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
  getRecentActivities (account_id: string) {
    return requestWaver(`/recent_activities?account_id=${account_id}`, {
      method: 'GET',
    });
  },
  getStatistics (account_id: string) {
    return requestWaver(`/statistics?account_id=${account_id}`, {
      method: 'GET',
    });
  },
  getTokenPriceHistory (token_id: string) {
    return requestWaver(`/token_price_history?account_id=${token_id}`, {
      method: 'GET',
    }); 
  },
}

export default waverApi;
