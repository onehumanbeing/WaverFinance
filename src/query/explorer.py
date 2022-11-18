import requests

API_URL = "https://api-testnet.nearblocks.io/v1/graphql" # "https://api.nearblocks.io/v1/graphql" # https://api-testnet.nearblocks.io/v1/graphql

query = """
query ($address: String, $contract: String, $limit: Int, $offset: Int) {
  transactions(
    limit: $limit
    offset: $offset
    order_by: { block_timestamp: desc }
    where: {
      receipts: {
        _and: [
          { predecessor_account_id: { _eq: $address } }
          { receiver_account_id: { _eq: $contract } }
        ]
      }
    }
  ) {
    ...transactionsFull
    transaction_actions {
      ...transactionActions
      __typename
    }
    block {
      ...blocks
      __typename
    }
    receipts {
      ...receiptsFull
      execution_outcome {
        ...executionOutcomes
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment blocks on blocks {
  block_height
  block_hash
  block_timestamp
  author_account_id
  __typename
}

fragment receiptsFull on receipts {
  receipt_id
  included_in_block_hash
  included_in_chunk_hash
  index_in_chunk
  included_in_block_timestamp
  predecessor_account_id
  receiver_account_id
  receipt_kind
  originated_from_transaction_hash
  __typename
}

fragment transactionsFull on transactions {
  transaction_hash
  included_in_block_hash
  included_in_chunk_hash
  index_in_chunk
  block_timestamp
  signer_account_id
  signer_public_key
  nonce
  receiver_account_id
  signature
  status
  converted_into_receipt_id
  receipt_conversion_gas_burnt
  receipt_conversion_tokens_burnt
  __typename
}

fragment executionOutcomes on execution_outcomes {
  gas_burnt
  tokens_burnt
  __typename
}

fragment transactionActions on transaction_actions {
  action_kind
  args
  __typename
}
"""


def get_near_trxs_by_address(address, contract, offset=0, limit=20, proxies=None):
    data = {
        "query": query,
        "variables": {
            "address": address,
            "contract": contract,
            "offset": offset,
            "limit": limit,
        }
    }

    result = requests.post(API_URL, json=data, proxies=proxies)
    return result.json()["data"]

local = { 
    "http"  : "http://127.0.0.1:7890", 
    "https" : "http://127.0.0.1:7890", 
}
print(get_near_trxs_by_address("testcandy.testnet", "paras-marketplace-v1.testnet", proxies=local))
