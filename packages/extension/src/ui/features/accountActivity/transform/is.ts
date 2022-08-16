import {
  ERC20TransferTransaction,
  NFTTransaction,
  TransformedTransaction,
} from "./type"

export const isErc20TransferTransaction = (
  transaction: TransformedTransaction,
): transaction is ERC20TransferTransaction => {
  const { type, amount, tokenAddress } = transaction
  return !!(
    amount &&
    tokenAddress &&
    (type === "SEND" || type === "RECEIVE" || type === "TRANSFER")
  )
}

export const isNFTTransaction = (
  transaction: TransformedTransaction,
): transaction is NFTTransaction => {
  const { tokenId, contractAddress } = transaction
  return !!(tokenId && contractAddress)
}
