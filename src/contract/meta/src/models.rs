use crate::*;
pub type TokenId = String;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Config {
    /// Name of the DAO and of the token.
    pub name: String,
    /// Token metadata: symbol.
    pub symbol: String,
    /// Token metadata: Url for icon.
    pub icon: Option<String>,
    /// Token metadata: link to reference.
    pub reference: Option<String>,
    /// Token metadata: reference hash to validate that reference link fetches correct data.
    pub reference_hash: Option<Base64VecU8>,
    /// Number of decimals in the token.
    pub decimals: u8
}