import json

def total_gas_burn(data):
    total = 0
    for action in data["receipts_outcome"]:
        total += action["outcome"]["gas_burnt"]
    return total / 1000000000000

def get_logs(data):
    result = list()
    for action in data["receipts_outcome"]:
        result.extend(action["outcome"]['logs'])
    print(result)

def get_result(data):
    symbol = "Trading failed"
    trade_success = True
    result = list()
    for action in data["receipts_outcome"]:
        res = action["outcome"]["status"]
        if "SuccessReceiptId" in res:
            continue
        # failed
        if "Failure" in res:
            msg = str(res["Failure"])
            if msg.find(symbol) != -1:
                trade_success = False
            result.append(msg)
    return result, trade_success

if __name__ == "__main__":
    with open("success.json", "r") as f:
        data = json.load(f)
        print(total_gas_burn(data))
        print(get_logs(data))
        print(get_result(data))