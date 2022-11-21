from index import token_price
from db import AccountContracts, AccountStrategies, get_user_activities, UserStatistic, create_or_update_strategy
from rpc import ft_balance, rpc_get_strategy, ft_metadata
from constants import WAVER_CONTRACT
from trade import trade_request

import math
import time
import traceback

BUY = 1
SALE = 2
GRID = 3

GTE = 1
LTE = 2

INIT = 1
ACTIVE = 2
PAUSED = 3
ENDED = 9
FAILED = 10

def update_strategy(contract_id, strategy_id):
    retry_times = 3
    current = 0
    while current < retry_times:
        try:
            data = rpc_get_strategy(contract_id, strategy_id)
            data['contract_id'] = contract_id
            data['index'] = strategy_id
            create_or_update_strategy(data)
            return
        except:
            current += 1
            continue

def main(start_time):
    print("main", start_time)
    _ = token_price("wrap.testnet", update=True, fromDex=True)
    contract_dict = dict()
    for col in AccountContracts.select():
        contract_dict[col.contract_id] = col.account_id
    for strategy in AccountStrategies.select():
        if strategy.status != ACTIVE:
            continue
        print(strategy.stype, strategy.contract_id, strategy.status)
        try:
            # TODO: check ft_balance
            is_trade = False
            if strategy.stype == BUY or strategy.stype == SALE:
                is_update = True if strategy.target_ft != "wrap.testnet" else False
                price = token_price(strategy.target_ft, update=True, fromDex=True)
                target_price = strategy.target_price / math.pow(10, 5)
                if strategy.stype == BUY:
                    token_in = strategy.invest_ft
                    token_out = strategy.target_ft # wrap.testnet
                else:
                    # SALE
                    token_in = strategy.target_ft
                    token_out = strategy.invest_ft
                if strategy.expression == GTE and price >= target_price:
                    is_trade = True
                elif strategy.expression == LTE and price <= target_price:
                    is_trade = True
                if is_trade:
                    metadata = ft_metadata(token_in)
                    dec = metadata['decimals']
                    token_in_amount = float(strategy.amount) / math.pow(10, dec)
                    print(token_in, token_out, token_in_amount, int(price * math.pow(10, 5)))
                    trade_request(contract_dict[strategy.contract_id], strategy.contract_id, token_in, token_out, token_in_amount, strategy.index, strategy.stype, int(price * math.pow(10, 5)), debug=True)
            elif strategy.stype == GRID:
                price = token_price(strategy.target_ft, update=True, fromDex=True)
                last_price = strategy.lastest_price / math.pow(10, 5)
                highest = strategy.highest_price / math.pow(10, 5)
                lowest = strategy.lowest_price / math.pow(10, 5)
                expired_time = strategy.created + strategy.time_period
                if int(time.time()) > expired_time:
                    continue
                if price > highest or price < lowest:
                    continue
                grid_intervel = strategy.grid_intervel / math.pow(10, 5)
                if abs(price - last_price) >= grid_intervel: 
                    is_trade = True
                    if price > last_price:
                        # sale near to usdc
                        token_in = strategy.target_ft
                        token_out = strategy.invest_ft
                        metadata = ft_metadata(token_in)
                        dec = metadata['decimals']
                        token_in_amount = float(strategy.grid_size) / math.pow(10, dec)
                    else:
                        # buy near with usdc
                        token_in = strategy.invest_ft
                        token_out = strategy.target_ft
                        token_in_amount = price * float(strategy.grid_size)
                if is_trade:
                    trade_request(contract_dict[strategy.contract_id], strategy.contract_id, token_in, token_out, token_in_amount, strategy.index, strategy.stype, int(price * math.pow(10, 5)), debug=True)
            # update strategy after request
            if is_trade:
                update_strategy(strategy.contract_id, strategy.index)
        except:
            print(traceback.format_exc())
            continue
    current = int(time.time())
    if current - start_time > 3600:
        for col in AccountContracts.select():
            data = {
                'contract_id': col.contract_id,
                'amount': 0.0,
                'trading_count': 0,
                'gas_burnt': 0.0
            }
            data['contract_id'] = col.contract_id
            for activity in get_user_activities(col.contract_id, start_time, current):
                data['gas_burnt'] += activity.gas_burnt
                data['amount'] += activity.price * int(activity.amount_in) / int(activity.amount_in_decimals)
                data['trading_count'] += 1
            UserStatistic.create(**data)
        return current
    return start_time
        

if __name__ == "__main__":
    start_time = int(time.time())
    while True:
        start_time = main(start_time)
        time.sleep(60)
