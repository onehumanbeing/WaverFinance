import { useEffect, useState } from "react";
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

export const useClientTokens = () => {
  return useWaverApiResultWithClientId<TGetTokensData>(async (contractId) => {
    const res = await waverApi.getTokens(contractId);
    return res.data;
  })
}

export const useWaverStatistic = () => {
  return useWaverApiResultWithClientId<TWaverStatistic>(async (contractId) => {
    const res = await waverApi.getStatistics(contractId);
    return res.data;
  })
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
