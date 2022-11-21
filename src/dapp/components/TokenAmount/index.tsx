import React from "react";

const getUnit = (contractId?: string) => {
  if (contractId === "wrap.testnet") {
    return "NEAR";
  }
  if (["usdt.fakes.testnet"].includes(contractId!)) {
    return "USDT";
  }
  if (["usdc.fakes.testnet"].includes(contractId!)) {
    return "USDC";
  }
  return "";
};

const getDicimal = (contractId?: string) => {
  if (contractId === "wrap.testnet") {
    return 24;
  }
  if (["usdt.fakes.testnet"].includes(contractId!)) {
    return 18;
  }
  if (["usdc.fakes.testnet"].includes(contractId!)) {
    return 18;
  }
  return 0;
};

const TokenAmount: React.FC<{
  contractId?: string,
  amount: string,
  usdMode?: boolean,
  withUnit?: boolean,
  dicimal?: number,
  mode?: "amountStr" | "directDigital",
}> = ({ contractId, amount, withUnit, dicimal, mode="directDigital" }) => {
  const unitPart = withUnit ? ` ${getUnit(contractId)}` : "";
  const getAmount = () => {
    if (amount === undefined || amount === "") {
      return "-"
    }
    if (mode === "amountStr") {
      const num = parseInt(amount) / Math.pow(10, dicimal ?? getDicimal(contractId));
      return num.toFixed(2);
    }
    return amount;
  }
  return <>{getAmount()}{unitPart}</>
}

export default TokenAmount;
