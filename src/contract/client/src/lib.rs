use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::json_types::{U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, PanicOnDefault, PromiseOrValue,
    Gas, BorshStorageKey, ext_contract, assert_self, PromiseResult //  log,
};
use near_units::{parse_gas, parse_near};

pub use crate::models::*;
mod models;
mod util;

pub const VERSION_CODE: &str  = "v1.0.0";
pub const GAS_FOR_CALL: Gas = Gas(parse_gas!("20 Tgas") as u64);
pub const GAS_FOR_FT_TRANSFER_CALL: Gas = Gas(parse_gas!("25 Tgas") as u64);
pub const GAS_FOR_STAKE_CALL: Gas = Gas(parse_gas!("25 Tgas") as u64);
pub const GAS_FOR_REF_TRANSFER_CALL: Gas = Gas(parse_gas!("120 Tgas") as u64);

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct StorageBalance {
    pub total: U128,
    pub available: U128,
}

#[ext_contract(ext_fungible_token)]
pub trait FungibleTokenContract {
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
    fn ft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
        msg: String
    ) -> PromiseOrValue<U128>;
    /// Returns the total supply of the token in a decimal string representation.
    fn ft_total_supply(&self) -> U128;
    /// Returns the balance of the account. If the account doesn't exist, `"0"` must be returned.
    fn ft_balance_of(&self, account_id: AccountId) -> U128;
    fn storage_deposit(
        &mut self,
        account_id: Option<AccountId>,
        registration_only: Option<bool>,
    ) -> StorageBalance;
}

#[ext_contract(ext_self)]
trait CallbackContract {
    fn ft_transfer_callback(&self);
    fn on_transfer_request(
        &mut self,
        strategy_id: String,
        price: u64
    ) -> Promise;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    pub contract_id: AccountId,
    pub strategies: UnorderedMap<String, Strategy>,
    pub index: u64
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    Strategies
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId, contract_id: AccountId) -> Self {
        let this = Self {
            owner_id: owner_id,
            contract_id: contract_id,
            strategies: UnorderedMap::new(StorageKey::Strategies),
            index: 1
        };
        this
    }

    fn assert_owner(&self) {
        if env::signer_account_id() != self.owner_id && env::predecessor_account_id() != env::current_account_id() {
            env::panic_str("Unvalid signer");
        }
    }

    fn assert_oracle(&self) {
        if env::predecessor_account_id() != self.contract_id && env::predecessor_account_id() != env::current_account_id() {
            env::panic_str("Unvalid request");
        }
    }

    fn assert_owner_or_oracle(&self) {
        if env::predecessor_account_id() != self.contract_id && env::predecessor_account_id() != self.owner_id && env::predecessor_account_id() != env::current_account_id()  {
            env::panic_str("Unvalid request");
        }
    }

    pub fn withdraw(&mut self, ft_contract: AccountId, amount: U128, memo: Option<String>) -> PromiseOrValue<bool> {
        self.assert_owner();
        near_sdk::PromiseOrValue::Promise(ext_fungible_token::ft_transfer(
            self.owner_id.clone(),
            amount.into(),
            memo,
            ft_contract.clone(),
            1,
            GAS_FOR_FT_TRANSFER_CALL
        ))
    }

    pub fn withdraw_near(&mut self, amount: U128) {
        self.assert_owner();
        util::transfer(&self.owner_id, amount.into());
    }

    pub fn oracle_request(&mut self, related_contract: AccountId, receiver_id: AccountId, amount: U128, msg: String, strategy_id: String, price: u64) -> PromiseOrValue<bool>  {
        self.assert_oracle();
        // verify request
        let _request_data = serde_json::from_str::<OracleActionRequest>(&msg).expect("Illegal msg in oracle_request");
        // request validate, finish request now.
        // TODO: verify related_contract in mainnet
        // check oracle logic
        let strategy = self.strategies.get(&strategy_id).unwrap_or_else(|| env::panic_str("Strategy not exists"));
        if strategy.status != ACTIVE {
            env::panic_str("Trading failed: Strategy is not active");
        }
        // check amount
        if strategy.stype == BUY || strategy.stype == SALE {
            if amount != strategy.amount.unwrap() {
                env::panic_str("Trading failed: Amount error when buying");
            }
        }
        // if strategy.stype == GRID {
        // }
        // run oracle request
        ext_fungible_token::ft_transfer_call(
            receiver_id.clone(),
            amount,
            msg,
            related_contract.clone(),
            1,
            GAS_FOR_REF_TRANSFER_CALL
        ).then(ext_self::on_transfer_request(
            strategy_id,
            price,
            env::current_account_id(),
            0,
            GAS_FOR_CALL,
        )).into()
    }

    pub fn on_transfer_request(
        &mut self,
        strategy_id: String,
        price: u64
    ) -> PromiseOrValue<bool> {
        assert_self();
        if let PromiseResult::Successful(value) = env::promise_result(0)  {
            // check if refund, refund means trading is failed
            if let Ok(result) = near_sdk::serde_json::from_slice::<U128>(&value) {
                // validate result
                if u128::from(result) == 0 {
                    // failed and refund
                    env::panic_str("Trading failed by exchange and refund");
                }
                // success, update strategy status
                let mut strategy = self.strategies.get(&strategy_id).unwrap_or_else(|| env::panic_str("Strategy not exists"));
                if strategy.stype == BUY || strategy.stype == SALE {
                    strategy.status = ENDED;
                } else {
                    // GRID
                    strategy.lastest_price = Some(price);
                }
                self.strategies.insert(&strategy_id, &strategy);
                PromiseOrValue::Value(true)
            } else {
                env::panic_str("Unreachable");
            }
        } else {
            env::panic_str("Trading failed");
        }
    }

    // actions
    pub fn remove_strategy(&mut self, id: String) -> Option<Strategy> {
        self.assert_owner();
        let strategy = self.strategies.remove(&id);
        if strategy.is_some() { Some(strategy.unwrap()) } else { None }
    }

    // views
    pub fn get_strategy(&self, id: String) -> Option<Strategy> {
        let strategy = self.strategies.get(&id);
        if strategy.is_some() {
            Some(strategy.unwrap())
        } else {
            None
        }
    }

    pub fn get_strategy_count(&self) -> u64 {
        self.strategies.len() as u64
    }

    pub fn get_strategy_list(
        &self, 
        from_index: Option<u64>,
        limit: Option<u64>
    ) -> Vec<String> {
        if self.get_strategy_count() == 0 {
            return Vec::new();
        }
        let start = from_index.unwrap_or(0);
        let page_size = limit.unwrap_or(50);
        if start > self.strategies.len() {
            return Vec::new();
        }
        let start_index = self.strategies.len() as u64 - u64::min(start + page_size, self.strategies.len() as u64);
        let end_index = self.strategies.len() as u64 - start;
        //iterate through the keys vector
        let keys = self.strategies.keys_as_vector();
        (start_index..std::cmp::min(end_index, keys.len())).rev()
            .map(|i| keys.get(i).unwrap())
            .collect()
    }

    pub fn create_strategy(
        &mut self,
        data: CreateStrategyRequest
    ) -> String {
        self.assert_owner();
        let strategy_id = self.index.to_string();
        self.index += 1;
        let strategy = Strategy::new(data);
        self.strategies.insert(&strategy_id, &strategy);
        strategy_id
    }

    pub fn update_strategy(&mut self, strategy_id: String, data: UpdateStrategyRequest) -> Strategy {
        self.assert_owner();
        let mut strategy = self.strategies.get(&strategy_id).unwrap_or_else(|| env::panic_str("Strategy not exists"));
        strategy.update(data);
        self.strategies.insert(&strategy_id, &strategy);
        strategy
    }

    pub fn stake_storage_deposit(&mut self, ft_contract: AccountId) -> PromiseOrValue<StorageBalance> {
        self.assert_owner_or_oracle();
        near_sdk::PromiseOrValue::Promise(ext_fungible_token::storage_deposit(
            Some(env::current_account_id()),
            Some(true),
            ft_contract.clone(),
            parse_near!("0.00125 N"),
            GAS_FOR_STAKE_CALL
        ))
    }
}