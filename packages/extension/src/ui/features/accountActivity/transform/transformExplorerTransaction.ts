import { isArray } from "lodash-es"
import { number } from "starknet"

import { IExplorerTransaction } from "../../../../shared/explorer/type"
import {
  getKnownDappForContractAddress,
  isKnownDappForContractAddress,
} from "../../../../shared/knownDapps"
import { Token } from "../../../../shared/token/type"
import { transactionNamesToTitle } from "../../../../shared/transactions"
import { isEqualAddress } from "../../../services/addresses"
import { getEntityWithName } from "./getEntityWithName"
import { getParameter } from "./getParameter"
import { getTokenForContractAddress } from "./getTokenForContractAddress"
import { TransformedTransaction, TransformedTransactionType } from "./type"

export interface ITransformExplorerTransaction {
  explorerTransaction: IExplorerTransaction
  accountAddress?: string
  tokensByNetwork?: Token[]
}

export const transformExplorerTransaction = ({
  explorerTransaction,
  accountAddress,
  tokensByNetwork,
}: ITransformExplorerTransaction): TransformedTransaction | undefined => {
  if (!explorerTransaction) {
    return
  }
  try {
    let type: TransformedTransactionType = "UNKNOWN"
    let result: TransformedTransaction = {
      type,
    }
    const { calls, events, maxFee, actualFee } = explorerTransaction
    const callNames = calls?.map(({ name }) => name)
    const eventNames = events.map(({ name }) => name)
    const firstCallName = callNames?.[0]
    const firstEventName = eventNames[0]
    let displayName = callNames ? transactionNamesToTitle(callNames) : "Unknown"
    if (maxFee && actualFee) {
      result = {
        ...result,
        maxFee: number.hexToDecimalString(maxFee),
        actualFee: number.hexToDecimalString(actualFee),
      }
    }
    if (firstCallName === "transfer") {
      type = "TRANSFER"
      displayName = "Transfer"
      const tokenAddress = events[0].address
      const parameters = events[0].parameters
      const fromAddress = getParameter(parameters, "from_")
      const toAddress = getParameter(parameters, "to")
      const amount = getParameter(parameters, "value")
      if (accountAddress && toAddress && fromAddress) {
        if (isEqualAddress(toAddress, accountAddress)) {
          type = "RECEIVE"
          displayName = "Receive"
        }
        if (isEqualAddress(fromAddress, accountAddress)) {
          type = "SEND"
          displayName = "Send"
        }
      }
      result = {
        ...result,
        fromAddress,
        toAddress,
        amount,
        tokenAddress,
      }
    } else if (firstCallName === "transferFrom") {
      type = "TRANSFER_ERC721"
      displayName = "Transfer NFT"
      const contractAddress = calls?.[0]?.address
      const parameters = calls?.[0]?.parameters
      const fromAddress = getParameter(parameters, "from_")
      const toAddress = getParameter(parameters, "to")
      const tokenId = getParameter(parameters, "tokenId")
      if (accountAddress && toAddress && fromAddress) {
        if (isEqualAddress(toAddress, accountAddress)) {
          type = "RECEIVE_ERC721"
          displayName = "Receive NFT"
        }
        if (isEqualAddress(fromAddress, accountAddress)) {
          type = "SEND_ERC721"
          displayName = "Send NFT"
        }
      }
      result = {
        ...result,
        fromAddress,
        toAddress,
        tokenId,
        contractAddress,
      }
    } else if (firstCallName === "mint") {
      if (events.length === 1 && firstEventName === "transaction_executed") {
        type = "MINT"
        displayName = "Mint"
        const tokenAddress = calls?.[0]?.address
        const parameters = calls?.[0].parameters
        const amount = getParameter(parameters, "tokenId")
        result = {
          ...result,
          amount,
          tokenAddress,
        }
      } else {
        type = "MINT_ERC721"
        displayName = "Mint NFT"
        const contractAddress = calls?.[0]?.address
        const parameters = events[0].parameters
        const tokenId =
          getParameter(parameters, "value") ||
          getParameter(parameters, "tokenId")
        result = {
          ...result,
          contractAddress,
          tokenId,
        }
      }
    } else if (firstEventName === "Upgraded") {
      if (firstCallName === "upgrade") {
        type = "UPGRADE_ACCOUNT"
        displayName = "Upgrade account"
      } else {
        type = "CREATE_ACCOUNT"
        displayName = "Create acount"
      }
    } else if (callNames?.includes("swapExactTokensForTokens")) {
      /** Alpha Road swap */
      const event = getEntityWithName(events, "Swap")
      const call = getEntityWithName(calls, "swapExactTokensForTokens")
      if (event && call) {
        type = "SWAP"
        const parameters = event.parameters
        const dappContractAddress = call.address
        const fromTokenAddress = getParameter(parameters, "token_from_address")
        const toTokenAddress = getParameter(parameters, "token_to_address")
        const fromAmount = getParameter(parameters, "amount_from")
        const toAmount = getParameter(parameters, "amount_to")
        result = {
          ...result,
          dappContractAddress,
          fromTokenAddress,
          toTokenAddress,
          fromAmount,
          toAmount,
        }
      }
    } else if (callNames?.includes("swap_exact_tokens_for_tokens")) {
      /** Jediswap swap */
      const event = getEntityWithName(events, "Swap")
      const call = getEntityWithName(calls, "swap_exact_tokens_for_tokens")
      if (event && call) {
        const path = getParameter(call.parameters, "path")
        if (isArray(path)) {
          type = "SWAP"
          const dappContractAddress = call.address
          const fromTokenAddress = path[0]
          const toTokenAddress = path[path.length - 1]
          const fromAmount = getParameter(event.parameters, "amount1In")
          const toAmount = getParameter(event.parameters, "amount0Out")
          result = {
            ...result,
            dappContractAddress,
            fromTokenAddress,
            toTokenAddress,
            fromAmount,
            toAmount,
          }
        }
      }
    } else if (
      JSON.stringify(eventNames) ===
      '["Approval","Transfer","Transfer","transaction_executed"]'
    ) {
      /** mySwap swap */
      const call = getEntityWithName(calls, "approve")
      if (call) {
        type = "SWAP"
        const dappContractAddress = getParameter(call.parameters, "spender")
        const fromTokenAddress = events[1].address
        const toTokenAddress = events[2].address
        const fromAmount = getParameter(events[1].parameters, "value")
        const toAmount = getParameter(events[2].parameters, "value")
        result = {
          ...result,
          dappContractAddress,
          fromTokenAddress,
          toTokenAddress,
          fromAmount,
          toAmount,
        }
      }
    } else if (
      JSON.stringify(eventNames) ===
      '["Approval","Approval","Transfer","Transfer","Transfer","transaction_executed"]'
    ) {
      /** Aspect buy NFT */
      const call = getEntityWithName(calls, "approve")
      if (call) {
        type = "BUY_ERC721"
        displayName = "Buy NFT"
        const dappContractAddress = getParameter(call.parameters, "spender")
        const contractAddress = events[2].address
        const tokenId = getParameter(events[2].parameters, "value")
        result = {
          ...result,
          dappContractAddress,
          contractAddress,
          tokenId,
        }
      }
    } else if (
      JSON.stringify(eventNames) ===
      '["Transfer","Transfer","Approval","Transfer","TakerBid","transaction_executed"]'
    ) {
      /** Mint Square buy NFT */
      const call = getEntityWithName(calls, "matchAskWithTakerBid")
      if (call) {
        type = "BUY_ERC721"
        displayName = "Buy NFT"
        const dappContractAddress = call.address
        const contractAddress = events[2].address
        const tokenId = getParameter(events[2].parameters, "value")
        result = {
          ...result,
          dappContractAddress,
          contractAddress,
          tokenId,
        }
      }
    } else {
      /** still unknow - crude test if any event or call `address` is a known dapp */
      const eventsAndCalls = calls ? [...events, ...calls] : events
      for (const eventsOrCall of eventsAndCalls) {
        const dappContractAddress = eventsOrCall.address
        if (isKnownDappForContractAddress(dappContractAddress)) {
          type = "DAPP"
          result = {
            ...result,
            dappContractAddress,
          }
          break
        }
      }
    }

    result.type = type

    if (result.tokenAddress) {
      const token = getTokenForContractAddress(
        result.tokenAddress,
        tokensByNetwork,
      )
      if (token) {
        result.token = token
      }
    }

    if (
      result.type === "SWAP" &&
      result.fromTokenAddress &&
      result.toTokenAddress
    ) {
      const fromToken = getTokenForContractAddress(
        result.fromTokenAddress,
        tokensByNetwork,
      )
      const toToken = getTokenForContractAddress(
        result.toTokenAddress,
        tokensByNetwork,
      )
      displayName = `Sold ${fromToken?.symbol || "unknown"} for ${
        toToken?.symbol || "unknown"
      }`
      if (fromToken) {
        result.fromToken = fromToken
      }
      if (toToken) {
        result.toToken = toToken
      }
    }

    if (result.dappContractAddress) {
      const dapp = getKnownDappForContractAddress(result.dappContractAddress)
      if (dapp) {
        /** omit the contracts */
        const { contracts: _contracts, ...rest } = dapp
        result.dapp = rest
      }
    }

    result.displayName = displayName
    return result
  } catch (e) {
    // don't throw on parsing error, UI will fallback to default
    console.log(e)
  }
}
