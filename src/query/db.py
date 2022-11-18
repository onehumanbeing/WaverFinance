from peewee import *
import datetime
import os
from playhouse.shortcuts import model_to_dict, ReconnectMixin
import json
import time

from constants import DB_NAME
db = SqliteDatabase(DB_NAME)

class HistoryTokenPrice(Model):
    contract_id = CharField(max_length=100)
    price = FloatField(default=0.0)
    updated = TimestampField()

    class Meta:
        database = db
        db_table = 'history_token_price'

class UserStatistic(Model):
    contract_id = CharField(max_length=100)
    amount = FloatField(default=0.0)
    trading_count = IntegerField(default=0)
    gas_burnt = FloatField(default=0.0)
    updated = TimestampField()

    class Meta:
        database = db
        db_table = 'user_statistic'

class RecentActivities(Model):
    """
    {'receiver_id': 'wrap.testnet', 'params': {'amount': '1000000000000000000000000', 'msg': '{"force":0,"actions":[{"pool_id":231,"token_in":"wrap.testnet","token_out":"dai.fakes.testnet","amount_in":"1000000000000000000000000","min_amount_out":"0"},{"pool_id":79,"token_in":"dai.fakes.testnet","token_out":"usdc.fakes.testnet","min_amount_out":"222582067"}]}', 'receiver_id': 'exchange.ref-dev.testnet'}, 'gas': '180000000000000', 'amount': '0.000000000000000000000001'}
    """
    contract_id = CharField(max_length=100)
    stype = IntegerField(default=1)
    index = CharField(max_length=100)
    amount_in_name = CharField(max_length=100)
    amount_out_name = CharField(max_length=100)
    amount_in_contract = CharField(max_length=100)
    amount_out_contract = CharField(max_length=100)
    amount_in_decimals = IntegerField(default=6)
    amount_out_decimals = IntegerField(default=6)
    amount_in = CharField(max_length=100)
    amount_out = CharField(max_length=100)
    price = FloatField(default=0.0)
    tgas = FloatField(default=0.0)
    gas_burnt = FloatField(default=0.0)
    logs = TextField(default='')
    success = BooleanField(default=True)
    failed_msg = TextField(default='')

    updated = TimestampField()

    class Meta:
        database = db
        db_table = 'recent_activities'

class TokenPrice(Model):
    contract_id = CharField(max_length=100)
    price = FloatField(default=0)
    updated = TimestampField()

    class Meta:
        database = db
        db_table = 'token_price'

class AccountContracts(Model):
    account_id = CharField(max_length=100)
    contract_id = CharField(max_length=255)
    updated = TimestampField()

    class Meta:
        database = db
        db_table = 'account_contracts'

class AccountStrategies(Model):
    contract_id = CharField(max_length=100)
    index = CharField(max_length=100)
    # params
    stype = IntegerField(default=1)
    target_ft = CharField(max_length=100)
    invest_ft = CharField(max_length=100)
    # if BUY or SALE
    amount = CharField(max_length=100, default='0')
    expression = IntegerField(default=1)
    target_price = IntegerField(default=0)
    status = IntegerField(default=0)
    # else if GRID
    grid_intervel = IntegerField(default=0)
    grid_size = CharField(max_length=100, default='0')
    highest_price = IntegerField(default=0)
    lowest_price = IntegerField(default=0)
    time_period = IntegerField(default=0)
    lastest_price = IntegerField(default=0)
    created = IntegerField(default=0)
    updated = TimestampField()

    class Meta:
        database = db
        db_table = 'account_strategies'

def get_user_daily_statistic(contract_id):
    query = UserStatistic.select().where(UserStatistic.contract_id == contract_id)
    return list(map(lambda col: model_to_dict(col), query))
    
def get_history_token_price(contract_id):
    query = HistoryTokenPrice.select().where(HistoryTokenPrice.contract_id == contract_id)
    return list(map(lambda col: model_to_dict(col), query))

def get_active_trading(contract_id):
    return AccountStrategies.select().where(AccountStrategies.stype != 3).count()

def get_active_strategies(contract_id):
    return AccountStrategies.select().where(AccountStrategies.stype == 3).count()

def get_gas_burnt(contract_id):
    query = RecentActivities.select().where(RecentActivities.contract_id == contract_id)
    res = 0.0
    for col in query:
        res += col.gas_burnt
    return res

def get_user_activities(contract_id, start, end):
    return RecentActivities.select().where(RecentActivities.contract_id == contract_id, RecentActivities.updated >= start, RecentActivities.updated <= end)


def get_total_trading_amount(contract_id, time_before):
    current_time = int(time.time()) - time_before
    query = RecentActivities.select().where(RecentActivities.contract_id == contract_id, RecentActivities.updated > current_time)
    res = 0
    for col in query:
        res += col.price * int(col.amount_in) / int(col.amount_in_decimals)
    return res

def get_token_price(contract_id):
    query = TokenPrice.select().where(TokenPrice.contract_id == contract_id).limit(1)
    if len(query) == 0:
        return None
    return model_to_dict(query[0])

def create_or_update_token_price(contract_id, price):
    query = TokenPrice.select().where(TokenPrice.contract_id == contract_id).limit(1)
    if len(query) != 0:
        query[0].delete_instance()
    col = TokenPrice.create(contract_id=contract_id, price=price)
    HistoryTokenPrice.create(contract_id=contract_id, price=price)
    return model_to_dict(col)


def create_or_update_strategy(params):
    query = AccountStrategies.select().where(AccountStrategies.contract_id == params['contract_id'], AccountStrategies.index == params['index']).limit(1)
    if len(query) != 0:
        query[0].delete_instance()
    data = dict()
    for key in params.keys():
        if params[key] is not None:
            data[key] = params[key]
    col = AccountStrategies.create(**data)
    return model_to_dict(col)

def get_account_contract(account_id):
    query = AccountContracts.select().where(AccountContracts.account_id == account_id).limit(1)
    if len(query) == 0:
        return None
    return model_to_dict(query[0])


def create_account_contract(account_id, contract_id):
    col = AccountContracts.create(account_id=account_id, contract_id=contract_id)
    return model_to_dict(col)


def remove_account_contract(account_id):
    query = AccountContracts.select().where(AccountContracts.account_id == account_id).limit(1)
    if len(query) == 0:
        return False
    query[0].delete_instance()
    return True

def recent_activity_list(contract_id, strategy_id):
    if strategy_id is None:
        query = RecentActivities.select().where(RecentActivities.contract_id == contract_id)
    else:
        query = RecentActivities.select().where(RecentActivities.contract_id == contract_id, RecentActivities.index == strategy_id)
    return list(map(lambda col: model_to_dict(col), query))


if __name__ == "__main__":
    if not os.path.exists(DB_NAME):
        db.connect()
        db.create_tables([AccountContracts, TokenPrice, AccountStrategies, RecentActivities, UserStatistic, HistoryTokenPrice])
