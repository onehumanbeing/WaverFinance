import os
from flask import (
    Flask, g, session, redirect, request, url_for, jsonify, 
    render_template, make_response, send_from_directory
)
import datetime
import json
import random
import requests

from constants import WAVER_CONTRACT, REF
from rpc import (
    rpc_get_contract,
    rpc_get_strategy,
    get_ref_request,
    parse_ref_data,
    likely_tokens,
    ft_balance
)
from db import (
    create_account_contract,
    create_or_update_strategy,
    create_or_update_token_price,
    get_token_price,
    recent_activity_list,
    get_history_token_price,
    get_user_daily_statistic,
)
from charts import (
    get_user_statistic
)

app = Flask(__name__)
app.debug = True

def token_price(contract_id, update=True, fromDex=False):
    try:
        if contract_id in ["usdt.fakes.testnet", "usdc.fakes.testnet"]:
            # stable coin
            return 1.0
        if contract_id == WAVER_CONTRACT:
            return 1.25
        if not update:
            col = get_token_price(contract_id)
            if col is not None:
                return col['price']
        # update or None
        if not fromDex:
            url = REF + "/get-token-price?token_id=" + token_id
            data = requests.get(url, timeout=5)
            price = float(data['price']) if data['price'] != 'N/A' else 0.0
            create_or_update_token_price(contract_id, price)
            return price
        # dex 
        info = get_ref_request(token_in=contract_id, token_out='usdc.fakes.testnet',in_amount=1)
        price_data = parse_ref_data(info)
        swap_price = price_data['swap_price']
        create_or_update_token_price(contract_id, swap_price)
        return swap_price
    except:
        return 0.0
    
def calc_total_amount(account_id):
    tokens = [
        "wrap.testnet",
        "usdt.fakes.testnet",
        "usdc.fakes.testnet",
        # "ft.waver.testnet"
    ]
    total_amount = 0.0
    token_list = list()
    for ft in tokens:
        ft_amount = ft_balance(account_id, ft)
        if ft_amount == 0:
            continue
        price = token_price(ft, update=False, fromDex=False)
        token_amount = price * ft_amount
        total_amount += token_amount
        token_list.append({
            "token_amount": token_amount,
            "ft_amount": ft_amount,
            "price": price,
            "contract_id": ft
        })
    return {
        "total_token_amount": total_amount,
        "list": token_list
    }

def response(status, msg, data=None):
    res = {
        "status": status,
        "msg": msg
    }
    if data is not None:
        res["data"] = data
    return jsonify(res)

def success():
    return response(0, "success")

@app.route('/api/daily_statistic')
def get_daily_statistic():
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")  
    result = get_user_daily_statistic(account_id)
    return response(0, "success", data={"list": result})

@app.route('/api/history_token_price')
def history_token_price():
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")
    result = get_history_token_price(account_id)
    return response(0, "success", data={"list": result})

@app.route('/api/statistic')
def get_statisitc():
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")
    result = get_user_statistic(account_id)
    return response(0, "success", data=result)

@app.route('/api/recent_activities')
def get_recent_activities():
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")
    strategy_id = request.args.get("strategy_id", None)
    result = recent_activity_list(account_id, strategy_id)
    return response(0, "success", data={"list": result})

@app.route('/api/user/tokens')
def get_tokens_of_user():
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")
    result = calc_total_amount(account_id)
    return response(0, "success", result)

@app.route('/api/active_strategy')
def active_strategy():
    # TODO: use indexer later
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")
    pk = request.args.get("id", None)
    if pk is None:
        return response(1, "id invalid")
    retry_times = 3
    current = 0
    while current < retry_times:
        try:
            data = rpc_get_strategy(account_id, pk)
            data['contract_id'] = account_id
            data['index'] = pk
            create_or_update_strategy(data)
            return success()
        except:
            current += 1
            continue
    return success()

@app.route('/api/active_contract')
def active_contract():
    # TODO: use indexer later
    account_id = request.args.get("account_id", None)
    if account_id is None:
        return response(1, "account_id invalid")
    retry_times = 3
    current = 0
    while current < retry_times:
        try:
            contract_id = rpc_get_contract(account_id)
            if contract_id is None:
                return response(2, "contract_id invalid")
            # set contract
            create_account_contract(account_id, contract_id)
            return success()
        except:
            current += 1
            continue
    return success()

@app.route('/api/token_price')
def req_token_price():
    token_id = request.args.get("token_id", WAVER_CONTRACT)
    if token_id == WAVER_CONTRACT:
        return jsonify({"token_contract_id": token_id, "price": "1.25"})
    url = REF + "/get-token-price?token_id=" + token_id
    data = requests.get(url, timeout=5)
    return jsonify(data)

@app.route('/api/stable_coin')
def stable_coin():
    # current only support stable coin to invest
    return jsonify({
        "list": [
            {
                "contract_id": "usdt.fakes.testnet",
                "symbol": "USDT.e",
                "name": 'Tether USD',
                "decimals": 6,
                "icon": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2326A17B'/%3E%3Cpath fill='%23FFF' d='M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117'/%3E%3C/g%3E%3C/svg%3E"
            },
            {
                "contract_id": "usdc.fakes.testnet",
                "symbol": "USDC",
                "name": 'USD Coin',
                "decimals": 6,
                "icon": "data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Ccircle cx='16' cy='16' r='16' fill='%232775C9'/%3E%3Cpath d='M15.75 27.5C9.26 27.5 4 22.24 4 15.75S9.26 4 15.75 4 27.5 9.26 27.5 15.75A11.75 11.75 0 0115.75 27.5zm-.7-16.11a2.58 2.58 0 00-2.45 2.47c0 1.21.74 2 2.31 2.33l1.1.26c1.07.25 1.51.61 1.51 1.22s-.77 1.21-1.77 1.21a1.9 1.9 0 01-1.8-.91.68.68 0 00-.61-.39h-.59a.35.35 0 00-.28.41 2.73 2.73 0 002.61 2.08v.84a.705.705 0 001.41 0v-.85a2.62 2.62 0 002.59-2.58c0-1.27-.73-2-2.46-2.37l-1-.22c-1-.25-1.47-.58-1.47-1.14 0-.56.6-1.18 1.6-1.18a1.64 1.64 0 011.59.81.8.8 0 00.72.46h.47a.42.42 0 00.31-.5 2.65 2.65 0 00-2.38-2v-.69a.705.705 0 00-1.41 0v.74zm-8.11 4.36a8.79 8.79 0 006 8.33h.14a.45.45 0 00.45-.45v-.21a.94.94 0 00-.58-.87 7.36 7.36 0 010-13.65.93.93 0 00.58-.86v-.23a.42.42 0 00-.56-.4 8.79 8.79 0 00-6.03 8.34zm17.62 0a8.79 8.79 0 00-6-8.32h-.15a.47.47 0 00-.47.47v.15a1 1 0 00.61.9 7.36 7.36 0 010 13.64 1 1 0 00-.6.89v.17a.47.47 0 00.62.44 8.79 8.79 0 005.99-8.34z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E"
            }
        ]
    })

@app.route('/api/list_coin_price')
def list_coin_price():
    url = "https://" + REF + "/list-token-price"
    data = requests.get(url, timeout=5)
    return jsonify(data)


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8000)

