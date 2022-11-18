import requests
import base64
import json
import time
import traceback
import math

TESTNET = "https://public-rpc.blockpi.io/http/near-testnet"
MAINNET = "https://public-rpc.blockpi.io/http/near"
url = TESTNET

from constants import WAVER_CONTRACT, HELPER_URL, ORACLE_CLIENT_HOST

TIMEOUT = 60
URL = ORACLE_CLIENT_HOST + "/v-api/getSwapSync?tokenIn={}&inAmount={}&tokenOut={}&"


def test_ref_price(contract_id):
    info = get_ref_request(token_in=contract_id, token_out='usdc.fakes.testnet',in_amount=1)
    price_data = parse_ref_data(info)
    swap_price = price_data['swap_price']
    print(swap_price)

def get_ref_request(token_in='wrap.testnet', token_out='usdc.fakes.testnet',in_amount=1):
    res = requests.get(URL.format(token_in, in_amount, token_out), timeout=TIMEOUT)
    data = res.json()['data']
    return data


def parse_ref_data(data):
    token_in_contract = data['tokenIn']['id']
    token_out_contract = data['tokenOut']['id']
    swap_price = float(data['result']['tokenOutAmount'])
    min_price = float(data['result']['minAmountOut']) 
    return {
        "swap_price": swap_price,
        "min_price": min_price,
        "slippage": ((swap_price - min_price) / swap_price) * 100
    }


def parse_result(data):
    if 'result' not in data['result']:
        print(data['result'])
        return None
    result = data['result']['result']
    r = ""
    for c in result:
        r += chr(c)
    return json.loads(r)


def rpc_get_contract(account_id):
    # near view $CONTRACT get_contract '{"account_id": "waver.testnet"}'
    params = base64.b64encode(bytes(json.dumps({"account_id": account_id}).encode('utf-8'))).decode('utf-8')
    data = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function", 
            "account_id": WAVER_CONTRACT, 
            "method_name": "get_contract", 
            "finality": "optimistic",
            "args_base64": params
            }
        }
    res = requests.post(url, json=data)
    data = res.json()
    return parse_result(data)

def rpc_get_strategy(contract_id, pk):
    # near view $CONTRACT get_strategy '{"id": "1"}'
    params = base64.b64encode(bytes(json.dumps({"id": str(pk)}).encode('utf-8'))).decode('utf-8')
    data = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function", 
            "account_id": contract_id, 
            "method_name": "get_strategy", 
            "finality": "optimistic",
            "args_base64": params
            }
        }
    res = requests.post(url, json=data)
    data = res.json()
    print(data, contract_id, pk)
    return parse_result(data)
    # {'stype': 2, 'target_ft': 'wrap.testnet', 'invest_ft': 'usdt.fakes.testnet', 'status': 2, 'created': 1666451066, 'amount': '10000000000000000000000000', 'expression': 1, 'target_price': 300000, 'grid_intervel': None, 'grid_size': None, 'highest_price': None, 'lowest_price': None, 'time_period': None, 'lastest_price': None}

def likely_tokens(account_id):
    url = HELPER_URL + "/account/" + account_id + "/likelyTokens"
    data = requests.get(url, timeout=5)
    return data
    # ["market.dev-1635425543381-88447653838944","dev-1666352371532-68272023080651","dev-1666358004339-61098069304894","x.testcandy.testnet","market.opshenry.testnet","dev-1666409321494-14779438481571","dev-1666338241415-57445920579878","wrap.testnet","usdt.fakes.testnet"]

def ft_metadata(contract_id):
    data = dict()
    params = base64.b64encode(bytes(json.dumps(data).encode('utf-8'))).decode('utf-8')
    data = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function", 
            "account_id": contract_id,
             "method_name": "ft_metadata", 
             "finality": "optimistic",
            "args_base64": params
            }
        }
    res = requests.post(url, json=data).json()
    return parse_result(res)

def decimals_cache(ft):
    data = {
        "usdc.fakes.testnet": 6,
        "usdt.fakes.testnet": 6,
        "wrap.testnet": 24,
        "ft.waver.testnet": 18,
    }
    return data[ft] if ft in data else None

def ft_balance(account_id, ft):
    dec = decimals_cache(ft)
    if dec is None:
        metadata = ft_metadata(ft)
        dec = metadata['decimals']
    data = {
        "account_id": account_id
    }
    params = base64.b64encode(bytes(json.dumps(data).encode('utf-8'))).decode('utf-8')
    data = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function", 
            "account_id": ft,
             "method_name": "ft_balance_of", 
             "finality": "optimistic",
            "args_base64": params
            }
        }
    res = requests.post(url, json=data).json()
    if 'result' not in res['result']:
        print(res['result'])
        return None
    result = res['result']['result']
    r = ""
    for c in result:
        r += chr(c)
    return int(r.replace('"', '').replace("'", "")) / math.pow(10, dec)


def save_metadata_for_dapp():
    for contract_id in [
        "wrap.testnet",
        "usdt.fakes.testnet",
        "usdc.fakes.testnet",
        "ft.waver.testnet"
    ]:
        print(contract_id)
        with open("/Users/henryuan/Desktop/" + contract_id + ".json", "w") as f:
            data = ft_metadata(contract_id)
            f.write(json.dumps(data))

if __name__ == "__main__":
    save_metadata_for_dapp()
    # test_ref_price("dev-1666409321494-14779438481571")
    # print(ft_balance("waver.testnet", "wrap.testnet"))
    # print(ft_metadata("usdc.fakes.testnet"))
    # print(rpc_get_strategy("dev-1666420389094-76463291034415", "1"))
    # print(rpc_get_contract("waver.testnet") is None)
    # print(rpc_get_contract("1waver.testnet") is None)
