import { useEffect, useState } from "react";
import { useClientContractId } from "../services/near/quan-client";
import waverApi, { TWaverActivity, TWaverStatistic } from "../services/rest/waver";

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

export const useWaverStatistic = () => {
  const [data, setData] = useState<TWaverStatistic>();
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
