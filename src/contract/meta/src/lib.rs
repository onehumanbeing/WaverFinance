use near_contract_standards::fungible_token::metadata::{
    FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC,
};
use near_contract_standards::fungible_token::FungibleToken;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedSet, LookupMap};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise, PublicKey,
    PromiseOrValue, assert_self, is_promise_success, ext_contract};
pub use crate::constants::*;
pub use crate::models::*;
mod constants;
mod models;

/// Container for all contract data.
#[derive(BorshSerialize, BorshDeserialize)]
pub struct ContractData {
    pub config: Config,
    /// The account ID of the contracts created.
    pub accounts: UnorderedSet<AccountId>,
    pub key: PublicKey,
    pub related_account: LookupMap<AccountId, AccountId>,
    pub oracle_price: u128,
    pub owner_id: AccountId,
    pub airdrop_reward: u128
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonConfig {
    pub config: Config,
    pub key: PublicKey,
    pub oracle_price: U128,
    pub owner_id: AccountId,
    pub airdrop_reward: U128
}

/// Versioned contract data. Allows to easily upgrade contracts.
#[derive(BorshSerialize, BorshDeserialize)]
pub enum VersionedContractData {
    Current(ContractData),
}

impl VersionedContractData {}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
pub struct Contract {
    /// Fungible token information and logic.
    pub token: FungibleToken,
    /// Rest of data versioned.
    data: VersionedContractData,
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct InitContractArgs {
    owner_id: AccountId,
    contract_id: AccountId
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OracleRequestArgs {
    related_contract: AccountId,
    receiver_id: AccountId,
    amount: U128, 
    msg: String, 
    strategy_id: String,
    price: u64
}

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct StorageArgs {
    ft_contract: AccountId
}

/// External interface for the callbacks to self.
#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn on_contract_create(
        &mut self,
        account_id: AccountId,
        attached_deposit: U128,
        predecessor_account_id: AccountId,
        reward: u128
    ) -> Promise;
    fn on_oracle_request(
        &mut self,
        _account_id: AccountId,
        signer_id: AccountId
    ) -> Promise;
}


// External interface for the client contract.
#[ext_contract(ext_client)]
pub trait ExtClient {
    fn oracle_request(&mut self, related_contract: AccountId, receiver_id: AccountId, amount: U128, msg: String, strategy_id: String, price: u64) -> PromiseOrValue<bool>;
    fn stake_storage_deposit(&mut self, ft_contract: AccountId) -> PromiseOrValue<StorageBalance>;
}



impl Contract {
    fn data(&self) -> &ContractData {
        match &self.data {
            VersionedContractData::Current(data) => data,
        }
    }

    fn data_mut(&mut self) -> &mut ContractData {
        match &mut self.data {
            VersionedContractData::Current(data) => data,
        }
    }
}


#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(config: Config, key: PublicKey, oracle_price: U128, owner_id: AccountId, total_supply: U128, airdrop_reward: U128) -> Self {
        assert!(!env::state_exists(), "ERR_CONTRACT_IS_INITIALIZED");
        let mut this = Self {
            token: FungibleToken::new(b"t".to_vec()),
            data: VersionedContractData::Current(ContractData {
                config,
                accounts: UnorderedSet::new(b"a".to_vec()),
                key,
                // account_balance: LookupMap::new(b"b".to_vec()),
                related_account: LookupMap::new(b"r".to_vec()),
                oracle_price: oracle_price.into(),
                owner_id: owner_id.clone(),
                airdrop_reward: airdrop_reward.into()
            }),
        };
        // Register balance for given contract itself.
        this.token
            .internal_register_account(&env::current_account_id());
        this.token.internal_deposit(&env::current_account_id(), total_supply.into());
        this
    }

    pub fn update_ft_config(&mut self, config: Config) {
        assert_self();
        self.data_mut().config = config;
    }

    /// Should only be called by this contract on migration.
    /// This is NOOP implementation. KEEP IT if you haven't changed contract state.
    /// If you have changed state, you need to implement migration from old state (keep the old struct with different name to deserialize it first).
    /// After migrate goes live on MainNet, return this implementation for next updates.
    #[init]
    pub fn migrate() -> Self {
        assert_eq!(
            env::predecessor_account_id(),
            env::current_account_id(),
            "ERR_NOT_ALLOWED"
        );
        let this: Contract = env::state_read().expect("ERR_CONTRACT_IS_NOT_INITIALIZED");
        this
    }

    pub fn get_config(&self) -> JsonConfig {
        let data = self.data();
        JsonConfig{
            config: data.config.clone(),
            key: data.key.clone(),
            oracle_price: data.oracle_price.into(),
            owner_id: data.owner_id.clone(),
            airdrop_reward: data.airdrop_reward.into()
        }
    }
 
    #[payable]
    pub fn create_contract(&mut self, contract_id: String) -> Promise {
        // User should storage balance before creating contract
        // In testnet will giveaway tokens for testing use
        if self.data_mut().related_account.get(&env::signer_account_id()).is_some() {
            env::panic_str("Account already registered")
        }
        assert!(
            env::attached_deposit() >= MIN_ATTACHED_BALANCE,
            "Not enough attached deposit to complete contract creation"
        );
        // TODO: validate contract id prefix is same with signer_id, not necessary now
        assert!(
            contract_id.find('.').is_none(),
            "The contract ID can't contain `.`"
        );
        let account_id = format!("{}.{}", contract_id, env::current_account_id());
        assert!(
            env::is_valid_account_id(account_id.as_bytes()),
            "The account ID is invalid"
        );
        let account = AccountId::new_unchecked(account_id);
        assert!(
            self.data_mut().accounts
                .insert(&account),
            "The contract ID already exists"
        );
        Promise::new(account.clone())
            .create_account()
            .transfer(env::attached_deposit()) // - parse_near!("0.00125 N"))
            .add_access_key(
                self.data().key.clone(),
                ACCESS_KEY_ALLOWANCE,
                env::current_account_id(),
                "request,storage".to_string(),
            )
            .deploy_contract(include_bytes!("../../client/out/main.wasm").to_vec())
            .function_call(
                "new".to_string(),
                near_sdk::serde_json::to_vec(&InitContractArgs {
                    owner_id: env::signer_account_id(),
                    contract_id: env::current_account_id()
                })
                .unwrap(),
                0,
                GAS_FOR_CALL * 2,
            )
            .then(ext_self::on_contract_create(
                account,
                env::attached_deposit().into(),
                env::predecessor_account_id(),
                self.data().airdrop_reward,
                env::current_account_id(),
                0,
                GAS_FOR_CALL * 2,
            ))
    }

    pub fn get_contract(&self, account_id: AccountId) -> Option<AccountId> {
        self.data().related_account.get(&account_id)
    }

    pub fn on_contract_create(
        &mut self,
        account_id: AccountId,
        attached_deposit: U128,
        predecessor_account_id: AccountId,
        reward: u128
    ) -> PromiseOrValue<bool> {
        assert_self();
        let is_created = is_promise_success();
        if is_created {
            env::log_str(
                &format!(
                    "The contract @{} was successfully created.",
                    account_id
                )
            );
            // give away token before return
            self.data_mut().related_account.insert(&predecessor_account_id, &account_id);
            self.token.internal_transfer(&env::current_account_id(), &predecessor_account_id, reward, Some("Airdrop".to_string()));
            PromiseOrValue::Value(true)
        } else {
            self.data_mut().accounts.remove(&account_id);
            env::log_str(
                &format!(
                    "The contract @{} creation has failed. Returning attached deposit of {} to @{}",
                    account_id,
                    attached_deposit.0,
                    predecessor_account_id
                )
            );
            Promise::new(predecessor_account_id).transfer(attached_deposit.0);
            PromiseOrValue::Value(false)
        }
    }

    pub fn storage(&mut self, ft_contract: AccountId) -> Promise {
        Promise::new(env::signer_account_id()).function_call(
            "stake_storage_deposit".to_string(),
            near_sdk::serde_json::to_vec(&StorageArgs {
                ft_contract: ft_contract
            })
            .unwrap(),
            0,
            GAS_FOR_CALL * 2
        )
    }

    pub fn request(&mut self, related_contract: AccountId, receiver_id: AccountId, amount: U128, msg: String, strategy_id: String, signer_id: AccountId, price: u64) -> Promise  {
        let contract_id = self.data_mut().related_account.get(&signer_id).unwrap_or_else(|| env::panic_str("Account Id not exists"));
        assert_eq!(
            contract_id,
            env::signer_account_id(),
            "ERR_NOT_ALLOWED"
        );
        Promise::new(env::signer_account_id()).function_call(
            "oracle_request".to_string(),
            near_sdk::serde_json::to_vec(&OracleRequestArgs {
                related_contract: related_contract,
                receiver_id: receiver_id,
                amount: amount, 
                msg: msg, 
                strategy_id: strategy_id,
                price: price
            })
            .unwrap(),
            0,
            GAS_FOR_ORACLE_REQUEST
        ).then(ext_self::on_oracle_request(
            env::signer_account_id(),
            signer_id,
            env::current_account_id(),
            0,                  // amount of yoctoNEAR to attach
            GAS_FOR_CALL,       // gas to attach
        ))
    }

    pub fn on_oracle_request(
        &mut self,
        _account_id: AccountId,
        signer_id: AccountId
    ) -> PromiseOrValue<bool> {
        assert_self();
        let is_success = is_promise_success();
        if is_success {
            let _new_token_balance = self.burn_token(&signer_id);
            PromiseOrValue::Value(true)
        } else {
            PromiseOrValue::Value(false)
        }
    }

    fn burn_token(&mut self, account_id: &AccountId) -> u128 {
        let balance = self.token.internal_unwrap_balance_of(&account_id);
        let oracle_price = self.data_mut().oracle_price;
        if let Some(new_token_balance) = balance.checked_sub(oracle_price) {
            self.token.internal_transfer(&account_id, &env::current_account_id(), oracle_price, Some("Oracle fee".to_string()));
            new_token_balance
        } else {
            env::panic_str("Token balance not enough");
        }
    }
}

// fungible token standard code
near_contract_standards::impl_fungible_token_core!(Contract, token);
near_contract_standards::impl_fungible_token_storage!(Contract, token);

#[near_bindgen]
impl FungibleTokenMetadataProvider for Contract {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: self.data().config.name.clone(),
            symbol: self.data().config.symbol.clone(),
            icon: self.data().config.icon.clone(),
            reference: self.data().config.reference.clone(),
            reference_hash: self.data().config.reference_hash.clone(),
            decimals: self.data().config.decimals,
        }
    }
}
// 