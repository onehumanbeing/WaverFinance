import React from "react";

const TokenAmount: React.FC<{
  contractId?: string,
  amount: string,
  usdMode?: boolean,
}> = ({ contractId, amount }) => {
  return <>{amount}</>
}

export default TokenAmount;
