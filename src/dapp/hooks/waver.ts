import { useCallback, useEffect, useState } from "react";
import { getAccountNearBalance } from "../services/near/near";
import { useClientContractId } from "../services/near/quan-client";
import waverApi, { TGetTokensData, TWaverActivity, TWaverStatistic } from "../services/rest/waver";

export const useWaverApiResultWithClientId = <TData> (fetchData: (contractId: string) => Promise<TData>) => {
  const [data, setData] = useState<TData>();
  const { contractId } = useClientContractId();

  useEffect(() => {
    if (!contractId) {
      return;
    }

    const fetch = async () => {
      const res = await fetchData(contractId);
      setData(res);
    }

    fetch();
  }, [contractId, fetchData]);

  return { data };
}

export const useAccountNearStatus = (accountId: string) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!accountId) {
      return;
    }

    const fetch = async () => {
      const res = await getAccountNearBalance(accountId);
      console.log("balance", { res })
      setData(res);
    }

    fetch();
  }, [accountId]);

  return { data };
}

export const useClientTokens = () => {
  const fetchData = useCallback(async (contractId: string) => {
    return await waverApi.getTokens(contractId);
  }, []);
  return useWaverApiResultWithClientId<TGetTokensData>(fetchData)
}

export const useWaverStatistic = () => {
  const fetchData = useCallback(async (contractId: string) => {
    return await waverApi.getStatistics(contractId);
  }, []);
  return useWaverApiResultWithClientId<TWaverStatistic>(fetchData)
}

export const useHistoryActivities = () => {
  const [activities, setActivities] = useState<TWaverActivity[]>();
  const { contractId } = useClientContractId();

  useEffect(() => {
    if (!contractId) {
      return;
    }

    const fetchActivities = async () => {
      const res = await waverApi.getRecentActivities(contractId);
      setActivities(res.list);
    }

    fetchActivities();
  }, [contractId]);

  return { activities };
}
// export const useWaverStatistic = () => {
//   const [data, setData] = useState<TWaverStatistic>();
//   const { contractId } = useClientContractId();

//   useEffect(() => {
//     if (!contractId) {
//       return;
//     }

//     const fetchActivities = async () => {
//       const res = await waverApi.getRecentActivities(contractId);
//       setActivities(res.list);
//     }

//     fetchActivities();
//   }, [contractId]);

//   return { activities };
// }
// export const useHistoryActivities = () => {
//   const [activities, setActivities] = useState<TWaverActivity[]>();
//   const { contractId } = useClientContractId();

//   useEffect(() => {
//     if (!contractId) {
//       return;
//     }

//     const fetchActivities = async () => {
//       const res = await waverApi.getRecentActivities(contractId);
//       setActivities(res.list);
//     }

//     fetchActivities();
//   }, [contractId]);
// }
