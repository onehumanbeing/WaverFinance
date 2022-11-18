from db import (
    get_active_trading,
    get_active_strategies,
    get_gas_burnt,
    get_total_trading_amount
)

def get_user_statistic(contract_id):
    return {
        "active_trading": get_active_trading(contract_id),
        "active_strategies": get_active_strategies(contract_id),
        "24h": get_total_trading_amount(contract_id, 86400),
        "7d": get_total_trading_amount(contract_id, 604800),
    }