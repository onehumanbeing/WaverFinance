import { providers } from "near-api-js";

const provider = new providers.JsonRpcProvider(
  // TODO: suit mainnet
  "https://archival-rpc.testnet.near.org"
);

export async function getAccountNearBalance(accountId: string) {
  try {
    const rawResult = await provider.query({
      request_type: "view_account",
      account_id: accountId,
      finality: "final",
    });
    return rawResult;
  } catch (e: any) {
    if (e.type === "AccountDoesNotExist") {
      return false;
    }
    throw e;
  }
}

// accountNearBalance();
