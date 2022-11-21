from rpc import get_ref_request, parse_ref_data
from secret import SECRET_KEY
from constants import WAVER_CONTRACT, DEFAULT_ORACLE_GAS, TEMP_TGAS

import json
import near_api
from rpc import ft_metadata
from parser import (
    get_result,
    get_logs,
    total_gas_burn
)
from db import (
    RecentActivities
)
from playhouse.shortcuts import model_to_dict


def oracle_request(account_id, contract_id, data, strategy_id, price):
    """
    Oracle request with function call key
    """
    near_provider = near_api.providers.JsonProvider("https://rpc.testnet.near.org")
    key_pair = near_api.signer.KeyPair(SECRET_KEY)
    signer = near_api.signer.Signer(contract_id, key_pair)
    account = near_api.account.Account(near_provider, signer, contract_id)
    request_data = {
        "strategy_id": strategy_id,
        "signer_id": account_id,
        "msg": data['params']['msg'],
        "amount": data['params']['amount'],
        "receiver_id": data['params']['receiver_id'],
        "related_contract": data['receiver_id'],
        "price": price
    }
    out = account.function_call(WAVER_CONTRACT, "request", request_data, DEFAULT_ORACLE_GAS)
    return out

def trade_request(account_id, contract_id, token_in, token_out, in_amount, strategy_id, stype, price, debug=True):
    token_in_metadata = ft_metadata(token_in)
    token_out_metadata = ft_metadata(token_out)
    data = get_ref_request(token_in, token_out, in_amount)
    price_data = parse_ref_data(data)
    result, is_deposit_needed = parse_data_command(account_id, data)
    # {'receiver_id': 'wrap.testnet', 'params': {'amount': '1000000000000000000000000', 'msg': '{"force":0,"actions":[{"pool_id":231,"token_in":"wrap.testnet","token_out":"dai.fakes.testnet","amount_in":"1000000000000000000000000","min_amount_out":"0"},{"pool_id":79,"token_in":"dai.fakes.testnet","token_out":"usdc.fakes.testnet","min_amount_out":"227585518"}]}', 'receiver_id': 'exchange.ref-dev.testnet'}, 'gas': '180000000000000', 'amount': '0.000000000000000000000001'}
    dex_params = json.loads(result['params']['msg'])['actions']
    total_amount_in = 0
    total_amount_out = 0
    for action in dex_params:
        if token_in == action['token_in']:
            total_amount_in += int(action['amount_in'])
        if token_out == action['token_out']:
            total_amount_out += int(action['min_amount_out'])

    out = oracle_request(account_id, contract_id, result, strategy_id, price)
    if debug:
        with open("trade.json", "w") as f:
            f.write(json.dumps(out))
    line = dict()
    line['tgas'] = total_gas_burn(out)
    line['gas_burnt'] = line['tgas'] * TEMP_TGAS
    line['contract_id'] = contract_id
    failed_msg, trade_success = get_result(out)
    line['success'] = trade_success
    line['failed_msg'] = failed_msg
    line['logs'] = str(get_logs(out))
    line['index'] = strategy_id
    line['amount_in'] = str(total_amount_in)
    line['amount_out'] = str(total_amount_out)
    line['amount_in_contract'] = token_in
    line['amount_out_contract'] = token_out
    line['price'] = price_data['swap_price']
    line['stype'] = stype
    line['amount_in_decimals'] = token_in_metadata['decimals']
    line['amount_out_decimals'] = token_out_metadata['decimals']
    line['amount_in_name'] = token_in_metadata['name']
    line['amount_out_name'] = token_out_metadata['name']
    line['transaction_id'] = out["receipts_outcome"][0]["id"] if len(out["receipts_outcome"]) > 0 else "5BpcayAo9T6tWeB8bEPS4HwfYrAPn3jht39UZFhSCLiL"
    col = RecentActivities.create(**line)
    return model_to_dict(col)

def parse_data_command(account_id, data):
    result = None
    is_deposit_needed = False
    try:
        transactions = data['result']['swapData']['transactions']
        for actions in transactions:
            for function in actions['functionCalls']:
                params = function["args"]
                if function['methodName'] == "storage_deposit":
                    print(function, actions['receiverId'])
                    is_deposit_needed = True
                    continue
                if function['methodName'] == "ft_transfer_call" and result is None:
                    result = {
                        'receiver_id': actions['receiverId'],
                        'params': params,
                        'gas': function['gas'],
                        'amount': function['amount']
                    }
                    continue
    except:
        print("parse_data_command error | " + traceback.format_exc())
    finally:
        return result, is_deposit_needed


if __name__ == "__main__":
    # account_id, contract_id, token_in, token_out, in_amount, strategy_id, debug=True
    r = trade_request("waver.testnet", "test.dev-1666421007416-91208904168266", "wrap.testnet", "usdc.fakes.testnet", 1, "1", 2, 2.88, debug=True)
    print(r)
