# Waver Finance

Waver Finance is the first decentralized quantitative trading platform on the NEAR protocol. 

We provide secure, transparent, intelligent, and low-cost quantitative trading services to all users.

# Codes

* src/contract/client: Waver locked sub-contract for users

* src/contract/meta: Waver main contract & ft contract

* src/query/index.py: Waver backend query server

* src/query/loop.py: Waver oracle request process

# Contracts

* client contract example [fundsaresafu.ft.waver.testnet](https://explorer.testnet.near.org/accounts/fundsaresafu.ft.waver.testnet)

* meta contract example [ft.waver.testnet](https://explorer.testnet.near.org/accounts/ft.waver.testnet)

# Transactions Examples

Oracle request failed, slippage error:

https://explorer.testnet.near.org/transactions/5YSRp5LBSha3YBufZ4SdYiZbMVaMoNqJ9BsQyrUa5AcC

Oracle request success:

https://explorer.testnet.near.org/transactions/568LGpmQmW2VwWMFj1KNwgjVnhqbBNzQUmZSvzZgTHRG

# Project Story

## Inspirations


In the early days, the price of NEAR showed periodic fluctuations. During that time, we had the idea of developing a native quantitative trading algorithm on NEAR, this is where the Waver Finance inspiration comes from.

However, how to provide users with safe services has become a main challenge, we are afraid of being hacked. Both the oracles that generate transactions and the smart contracts themselves can be attacked, and the risk is super high.

We have seen many people deploy a transaction contract provided by others on Ethereum or BSC, and end up losing money because of malicious code. Security incidents are happening on web3 every day. What’s more, on centralized exchanges like Binance, grid trading fees range from 0.54% to 1.10%. Fees are high and funds are not safe.

After FTX lost more than $1 billion, we deeply believe that people will lose confidence in centralized platforms and bullish in decentralized platforms.

Combining the problem statement we mentioned above, and the recent centralized trading platforms bad news, we think about whether it is possible to provide customers with an absolutely safe trading platform under the context of **zero trust**.

So it's our mission to launch Waver Finance. We believe that we can use the design mechanism of the NEAR smart contract to implement a **zero-trust-based** asset custody protocol and build a transparent and secure quantitative trading platform to solve all these problems. 


&nbsp;
&nbsp;


## What it does


Waver Finance is the first decentralized quantitative trading platform that provides secure, transparent, intelligent, and low-cost quantitative trading services for all users on the NEAR protocol.

Users can use Waver Finance to obtain their locked sub-contracts and send assets to the sub-contracts. Users can create their own strategies to achieve automated trading or grid trading for the escrowed assets. Users only pay for gas and transition fees, and Waver Finance will pay $WAVER for each oracle request. The user's assets are locked on the sub-contract, and only the user can withdraw the funds. Waver Finance has set up independent security mechanisms in both the signature (functionCall access key) and the subcontract (which will verify the oracle request in the contract).

Nowadays, **Centralized** trading services hold the dominant power of the transaction. Therefore, *users* bear a huge risk on their assets at any time. **Decentralized** trading platform, on the contrary, not only saves maintenance costs, but also creates a new business model that allows users to win-win with the platform and stand on an equal and transparent position. On the one hand, the platform can reduce customer acquisition costs through the **zero-trust** basis brought by smart contracts, and focus on providing users with financial and other services. On the other hand, users can trust their own assets and enjoy the services brought by the platform. 

It's a win-win situation, and to achieve the main accomplishment of our project: **security**


Here's an overview of the big idea:
![graph](https://raw.githubusercontent.com/onehumanbeing/WaverFinance/master/docs/Waver.png)




&nbsp;
&nbsp;

## How we built it

The 3rd stake battle of NEAR inspired us to build platform-based services. Specifically, the design of the Staking contract and AccessKey license on NEAR gave us the core ideas, and we developed Waver Finance's two main contracts based on them.

*waver_meta* is Waver Finance's master contract and FT contract. When a user registers and staked 2 Near, the main contract will deploy a sub-contract *waver_client* for the user, and add signature permissions for the *request* and *storage* functions with a *functionCall* permissions. The *request* function is mainly used for oracle machine calls, and the *storage* function is mainly used for token staking registration. At the end of each user's registration, we will airdrop 10 $WAVER to motivate users to explore the service.

*waver_client* allows each user to have a unique client contract. If the user's wallet address is *alex.testnet*, he will get a wallet *alex.waver.testnet*. By transferring cryptocurrency assets to this wallet, users can keep their assets in escrow. The client contract stores all trading strategies, and checks the legitimacy of the request for the user based on the strategy ID when the oracle machine submits it. This allows users and oracles to work together with *zero-trust*.

Our Dapp & dashboard is built with React.js and next.js. Our backend query server is built with Flask, a micro server written in Python and deployed on AWS. We use a timed process to simulate the flow of automated trading.



&nbsp;
&nbsp;






## Challenges we ran into


It is undeniable that security is the top priority of financial projects. During the trading process, both the oracle machine and the smart contract itself are at risk of being hacked. The core challenge and highlight of Waver Finance is to utilize design of the NEAR smart contract to implement a **zero-trust-based** asset escrow protocol, thereby establishing a transparent and secure quantitative trading platform. Through the multi-keyPair and sub-contract mechanism of the NEAR protocol, Waver Finance guarantees that even if the oracle machine is hacked, the user's assets are absolutely safe.




&nbsp;
&nbsp;

## Accomplishments that we're proud of

Our project leader Henry has been learning NEAR since January, he is the co-founder of Near Tinker Union (NFT project), responsible for the development of all smart contracts. Our team member then started to learn more about the NEAR ecosystem with him.

What makes us most proud is that we managed to complete the development of the Waver Finance project during this hackathon period, which was completely beyond our expectations.



&nbsp;
&nbsp;


## Business Model 

Traditional exchanges charge a certain percentage of grid trading volume as service fees. For example, Binance’s service fee ranges from 0.54% to 1.10%. On Waver Finance, if users need to use quantitative services, they need to purchase $WAVER on the exchange. When the transaction is successfully executed, the main contract will be paid in $WAVER. In addition, users only need to bear extremely low Gas fees and transition fees of less than 0.3% , which is friendly to whale users.

With less server and ops cost, Waver Finance will use this tokenomics to maintain and sustain its unique business model.



&nbsp;
&nbsp;


## What we learned


The main thing we learned was a deeper understanding of NEAR's underlying multi-signature mechanism and how to use it. We try to implement the ability to migrate contract state to update a contract with structural changes. At the same time, we also learn about decentralized prophecy machines to make the execution layer of the entire quantitative network more decentralized.



&nbsp;
&nbsp;


## What's next for Waver Finance

What we have done for Waver Finance so far is only the beginning of our journey, there is still a long way to go and expand. Most importantly, we believe that Waver Finance can truly bring great impact and value to the market and contribute to the NEAR community.

Here's an overview of Waver Finance's future journey:

- **2023 Q1** : Improve tokenomic by developing our own liquidity staking pool, perform code audit, launch testnet and start airdrop.

- **2023 Q2** : Launch the main network, support the development of leveraged funds and launch the test network

- **2023 Q3** : Support leveraged funds on the mainnet, start the development of custom quantitative trading algorithms and economic design

- **2023 Q4** : Launch custom quantitative trading algorithm, launch oracle decentralized test network



&nbsp;
&nbsp;
