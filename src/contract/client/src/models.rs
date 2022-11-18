use crate::*;
pub type TokenId = String;
use near_sdk::{
    AccountId
};

// stype
pub const BUY: i32 = 1;
pub const SALE: i32 = 2;
pub const GRID: i32 = 3;

// expression
pub const GTE: i32 = 1;
pub const LTE: i32 = 2;

// status
pub const INIT: i32 = 1;
pub const ACTIVE: i32 = 2;
pub const PAUSED: i32 = 3;
pub const ENDED: i32 = 9;
pub const FAILED: i32 = 10;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct CreateStrategyRequest {
    pub stype: i32,
    pub target_ft: AccountId,
    pub invest_ft: AccountId,
    // if BUY or SALE
    pub amount: Option<U128>,
    pub expression: Option<i32>,
    pub target_price: Option<u64>, // 
    // else if GRID
    pub grid_intervel: Option<u64>,
    pub grid_size: Option<U128>,
    pub highest_price: Option<u64>,
    pub lowest_price: Option<u64>,
    pub time_period: Option<u64>
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct UpdateStrategyRequest {
    pub target_ft: Option<AccountId>,
    pub invest_ft: Option<AccountId>,
    pub status: Option<i32>,
    pub amount: Option<U128>,
    pub expression: Option<i32>,
    pub target_price: Option<u64>, 
    pub grid_intervel: Option<u64>,
    pub grid_size: Option<U128>,
    pub highest_price: Option<u64>,
    pub lowest_price: Option<u64>,
    pub time_period: Option<u64>,
    pub lastest_price: Option<u64>
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Strategy {
    pub stype: i32,
    pub target_ft: AccountId,
    pub invest_ft: AccountId,
    pub status: i32,
    pub created: u64,
    // if BUY or SALE
    pub amount: Option<U128>,
    pub expression: Option<i32>,
    pub target_price: Option<u64>, // 
    // else if GRID
    pub grid_intervel: Option<u64>,
    pub grid_size: Option<U128>,
    pub highest_price: Option<u64>,
    pub lowest_price: Option<u64>,
    pub time_period: Option<u64>,
    //    GRID var
    pub lastest_price: Option<u64>
}

impl Strategy {
    pub fn new(
        data: CreateStrategyRequest
    ) -> Self {
        // let status = if data.stype == GRID {
        //     INIT
        // } else {
        //     ACTIVE
        // };
        Strategy {
            stype: data.stype,
            target_ft: data.target_ft,
            invest_ft: data.invest_ft,
            status: INIT,
            created: util::current_time().into(),
            amount: data.amount,
            expression: data.expression,
            target_price: data.target_price,
            grid_intervel: data.grid_intervel,
            grid_size: data.grid_size,
            highest_price: data.highest_price,
            lowest_price: data.lowest_price,
            time_period: data.time_period,
            lastest_price: None
        }
    }

    pub fn update(
        &mut self,
        data: UpdateStrategyRequest
    ) {
        if data.target_ft.is_some() {
            self.target_ft = data.target_ft.unwrap();
        }
        if data.invest_ft.is_some() {
            self.invest_ft = data.invest_ft.unwrap();
        }
        if data.status.is_some() {
            self.status = data.status.unwrap();
        }
        if data.amount.is_some() {
            self.amount = data.amount;
        }
        if data.expression.is_some() {
            self.expression = data.expression;
        }
        if data.target_price.is_some() {
            self.target_price = data.target_price;
        }
        if data.grid_intervel.is_some() {
            self.grid_intervel = data.grid_intervel;
        }
        if data.grid_size.is_some() {
            self.grid_size = data.grid_size;
        }
        if data.highest_price.is_some() {
            self.highest_price = data.highest_price;
        }
        if data.lowest_price.is_some() {
            self.lowest_price = data.lowest_price;
        }
        if data.time_period.is_some() {
            self.time_period = data.time_period;
        }
        if data.lastest_price.is_some() {
            self.lastest_price = data.lastest_price;
        }
    }
}

// REF
/// Message parameters to receive via token function call.
/// Single swap action.
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SwapAction {
    /// Pool which should be used for swapping.
    pub pool_id: u64,
    /// Token to swap from.
    pub token_in: AccountId,
    /// Amount to exchange.
    /// If amount_in is None, it will take amount_out from previous step.
    /// Will fail if amount_in is None on the first step.
    pub amount_in: Option<U128>,
    /// Token to swap into.
    pub token_out: AccountId,
    /// Required minimum amount of token_out.
    pub min_amount_out: U128,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OracleActionRequest {
    pub actions: Vec<SwapAction>
}

