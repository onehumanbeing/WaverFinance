# Waver Finance

Waver Finance is the first decentralized quantitative trading platform on the NEAR protocol. 

We provide secure, transparent, intelligent, and low-cost quantitative trading services to all users.

# Codes

* src/contract/client: Waver locked sub-contract for users

* src/contract/meta: Waver main contract & ft contract

* src/query/index.py: Waver backend query server

* src/query/loop.py: Waver oracle request process

# Transactions Examples

Oracle request failed, slippage error:

https://explorer.testnet.near.org/transactions/5YSRp5LBSha3YBufZ4SdYiZbMVaMoNqJ9BsQyrUa5AcC

Oracle request success:

https://explorer.testnet.near.org/transactions/568LGpmQmW2VwWMFj1KNwgjVnhqbBNzQUmZSvzZgTHRG

# Project Story

## Inspirations

I'm Henry and I learned about NEAR in January, and launched Near Tinker Union, an NFT project, in February, as a co-founder responsible for the development of all the smart contracts. From then on, I and my team started to learn more about the NEAR ecosystem. NEAR's multi-signature mechanism, ease of use, and security appealed to me. We strongly believe that the NEAR protocol is an important bridge for the Internet to transition from Web 2 to Web 3. However, the NEAR ecosystem is not mature enough for the application ecosystem at the moment. Therefore, we want to find a piece where we can contribute, combining my insights on NEAR smart contracts and business models to contribute to the liquidity and active user base of the NEAR ecosystem.

The inspiration for *Waver* came from our earlier experience developing in the NEAR network. From March to April, the price of NEAR showed periodic fluctuations, and I had the idea of developing a native quantitative trading algorithm on NEAR. 
We strongly believed that we were able to leverage the design mechanism of NEAR smart contracts to implement a zero-trust-based asset custody protocol and establish a transparent and secure quantitative trading platform. 

However, how to provide users with secure services has become a challenge and we are fearful of being hacked. Both the oracles that generate the transactions and the smart contracts themselves can be attacked, making the risk seem high.

I saw people deploy trading contracts provided by other on Ethereum or BSC, and eventually lose their money because of malicious code. Security incidents have been happening every day in web3. What's more, on centralized exchanges like Binance, grid trading fees range from 0.54% to 1.10%. The fee is high and the funds are not safe. 

After FTX loses over $1 billion, we deeply believe that people will be bullish on decentralized buildings and our project works a lot on making trading safer. 

What we want to gift our client is an absolutely safe trading platform In the context of zero trust.

Therefore, it's our mission to launch Waver, which will solve all these problems. The NEAR protocol gave us an answer.

## What it does

Our project, Waver Finance, is the first decentralized quantitative trading platform on NEAR. It is based on the NEAR protocol and provides secure, transparent, intelligent, and low-cost quantitative trading services to all users. 

Users can use Waver to get their own locked sub-contract and send assets to the sub-contract. While the assets are escrowed, Users can create their strategy to achieve auto trading or grid trading. Users only need to pay for gas and transition fees, Waver will cost $WAVER for each oracle request. Users' assets are locked on the sub-contract and only the user could withdraw the funds. Waver sets up independent security mechanisms in both signatures (functionCall access key) and subcontracts (will verify oracle request in the contract).

## How we built it

The 3rd stake battle of NEAR inspired me to build the platform-based service. Specifically, the design of staking contracts and AccessKey licensing on NEAR gave me the core idea, and we developed Waver's two main contracts based on them.

*waver_meta* is Waver's master contract and FT contract. When a user registers and staked 2 Near, the main contract deploys a subcontract *waver_client* for the user and adds signature permissions for the *request* and *storage* functions with a *functionCall* permission. The *request* function is mainly used for oracle machine calls, and the *storage* function is mainly used for token staking registration. At the end of each user's registration, we will airdrop 10 $WAVER to incentivize the user to experience the services.

*waver_client* allows each user to have a unique client contract. If the user's wallet address is *alex.testnet*, he would get a wallet *alex.waver.testnet*. By transferring cryptocurrency assets to this wallet, users can have their assets held in escrow. The client contract stores all trading strategies, and checks the legitimacy of the request against the strategy ID for the user when the oracle machine submits it. This allows the user and the oracle machine to work together with zero trust.

Our Dapp & dashboard is based on React.js, and next.js. Our backend query server is based on Flask, a micro server written in python, deployed on AWS. We use a timed process to simulate the flow of automated trading.

## Challenges we ran into

For financial projects, security is especially important. During the trading process, both the oracle machine and the smart contract itself have the risk of being hacked. The core challenge and highlight of Waver is to utilize the design of NEAR smart contracts to achieve a zero-trust-based asset escrow protocol, thus establishing a transparent and secure quantitative trading platform. Through the multi-keyPair and sub-contract mechanism of NEAR protocol, Waver ensures that even when the oracle machine is hacked, users' assets are absolutely safe.

## Accomplishments that we're proud of

Nowadays, in a **centralized** quantitative trading service, the *platform* holds a dominant power of the transaction. The *user*, hence, bears a huge risk with the asset at any time. A **decentralized** trading platform, on the contrary, not only saves maintenance costs, but also creates a new business model that allows users to win together with the platform, from an equal and transparent position. On one hand, the platform can reduce customer acquisition costs through the zero-trust basis brought by smart contracts, and focus on providing financial and other services to users. On the other hand, users can trust their assets and enjoy the services brought by the platform. This is a win-win situation, and it is easy to achieve with the main **accomplishment** of our project: **security**.

Traditional exchanges take a percentage of the amount volume traded on the grid as a service fee, such as Binance's fee is 0.54% to 1.10%. At Waver, on contrary, the main contract will take $WAVER as a payout when a trade is executed successfully. In addition, the user only has to bear a minuscule Gas fee and transition fee which is lower than 0.3% which will be friendly for whale users. If users need to use the quantitative service, they need to buy $WAVER on the exchange subsequently, and Waver Finance will use its token economic to maintain its unique business model. 
With less server and ops cost, Waver Finance will use its token economic to maintain its unique business model in the future.

## What we learned

Through Waver, we have gained a deeper understanding of Near's underlying multi-signature mechanism and how to use it. Also, in this development, we tried to implant the ability to migrate the contract state to update one contract with struct changes. We are also learning about the decentralized prophecy machine so that we can make the whole execution layer of the quantified network more decentralized in the future.

## What's next for Waver

After verifying the business model, we will create our own liquidity pledge pool and provide users with trading leverage and other services. In the future, users will also be able to upload their own decentralized quantitative strategies on Waver and get use clients and profits through the platform. We believe that Waver has a big story and a bright future.