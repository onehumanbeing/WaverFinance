use near_units::{parse_near, parse_gas};
use near_sdk::Gas;

pub const ACCESS_KEY_ALLOWANCE: u128 = parse_near!("0 N");
pub const MIN_ATTACHED_BALANCE: u128 = parse_near!("2 N");
pub const GAS_FOR_CALL: Gas = Gas(parse_gas!("25 Tgas") as u64);
pub const GAS_FOR_ORACLE_REQUEST: Gas = Gas(parse_gas!("200 Tgas") as u64);
