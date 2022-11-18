import { Near, WalletConnection } from "near-api-js"
import BN from 'bn.js';
import { FunctionCallOptions } from "near-api-js/lib/account"
import { Action, createTransaction, functionCall } from "near-api-js/lib/transaction"
import { PublicKey } from "near-api-js/lib/utils"
import { base_decode } from "near-api-js/lib/utils/serialize"

export class SignMultipleTrxsHelper {

	public near!: Near
	public wallet!: WalletConnection

	constructor({ near, wallet }: { near: Near, wallet: WalletConnection }) {
		this.near = near;
		this.wallet = wallet;
	}

	async createTransaction({
		receiverId,
		actions,
		nonceOffset = 1,
	}: {
		receiverId: string
		actions: Action[]
		nonceOffset?: number
	}) {
		const localKey = await this.near.connection.signer.getPublicKey(
			this.wallet.account().accountId,
			this.near.connection.networkId
		)
		const accessKey = await this.wallet
			.account()
			.accessKeyForTransaction(receiverId, actions, localKey)
		if (!accessKey) {
			throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`)
		}

		const block = await this.near.connection.provider.block({ finality: 'final' })
		const blockHash = base_decode(block.header.hash)

		const publicKey = PublicKey.from(accessKey.public_key)
		const nonce = accessKey.access_key.nonce + nonceOffset

		return createTransaction(
			this.wallet.account().accountId,
			publicKey,
			receiverId,
			nonce,
			actions,
			blockHash
		)
	}

	public async executeMultipleTransactions(
		transactions: {
			receiverId: string
			functionCalls: FunctionCallOptions[]
		}[],
		callbackUrl?: string
	) {
		const nearTransactions = await Promise.all(
			transactions.map((t, i) => {
				return this.createTransaction({
					receiverId: t.receiverId,
					nonceOffset: i + 1,
					actions: t.functionCalls.map((fc) =>
						functionCall(fc.methodName, fc.args, fc.gas as BN, fc.attachedDeposit as BN)
					),
				})
			})
		)

		return this.wallet.requestSignTransactions({
      transactions: nearTransactions,
      callbackUrl,
    })
	}
}
