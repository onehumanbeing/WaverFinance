from db import (
    get_active_trading,
    get_active_strategies,
    get_gas_burnt,
    get_total_trading_amount,
    get_account_contract
)

def get_user_statistic(contract_id):
    info = get_account_contract(contract_id)
    if info is None:
        sub_contract_id = contract_id
    else:
        sub_contract_id = info['contract_id']
    return {
        "active_trading": get_active_trading(contract_id),
        "active_strategies": get_active_strategies(contract_id),
        "24h": get_total_trading_amount(sub_contract_id, 86400),
        "7d": get_total_trading_amount(sub_contract_id, 604800),
        "gas": get_gas_burnt(sub_contract_id)
    }
