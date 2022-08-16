import { KnownDapp } from "../../../../shared/knownDapps"
import { Token } from "../../../../shared/token/type"

export type TransformedTransactionType =
  | "UNKNOWN"
  | "CREATE_ACCOUNT"
  | "UPGRADE_ACCOUNT"
  | "MINT"
  | "TRANSFER"
  | "SEND"
  | "RECEIVE"
  | "SWAP"
  | "MINT_ERC721"
  | "TRANSFER_ERC721"
  | "SEND_ERC721"
  | "RECEIVE_ERC721"
  | "BUY_ERC721"
  | "DAPP"

export interface BaseTransformedTransaction {
  type: TransformedTransactionType
  displayName?: string
  maxFee?: string
  actualFee?: string
  fromAddress?: string
  toAddress?: string
  amount?: string
  tokenAddress?: string
  token?: Token
  contractAddress?: string
  tokenId?: string
  dappContractAddress?: string
  dapp?: Omit<KnownDapp, "contracts">
  fromTokenAddress?: string
  toTokenAddress?: string
  fromAmount?: string
  toAmount?: string
  fromToken?: Token
  toToken?: Token
}

export interface ERC20TransferTransaction extends BaseTransformedTransaction {
  amount: string
  fromAddress: string
  toAddress: string
  tokenAddress: string
  contractAddress: never
  tokenId: never
}

export interface NFTTransaction extends BaseTransformedTransaction {
  amount: never
  tokenAddress: never
  token: never
  contractAddress: string
  tokenId: string
}

export type TransformedTransaction =
  | BaseTransformedTransaction
  | ERC20TransferTransaction
  | NFTTransaction
