near call $CONTRACT stake_storage_deposit '{"ft_contract": "usdt.fakes.testnet"}' --accountId waver.testnet --gas 300000000000000 
near call $CONTRACT stake_storage_deposit '{"ft_contract": "wrap.testnet"}' --accountId waver.testnet --gas 300000000000000 
near call wrap.testnet ft_transfer '{"receiver_id": "'$CONTRACT'", "amount": "3000000000000000000000000"}' --accountId waver.testnet --amount 0.000000000000000000000001
near call $CONTRACT oracle_request "$(<oracle_failed.json)" --accountId waver.testnet --gas 300000000000000 