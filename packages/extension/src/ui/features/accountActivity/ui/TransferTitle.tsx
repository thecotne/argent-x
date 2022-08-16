import { FC } from "react"
import styled from "styled-components"

import {
  prettifyCurrencyValue,
  prettifyTokenAmount,
} from "../../../../shared/token/price"
import { useAppState } from "../../../app.state"
import { isEqualAddress } from "../../../services/addresses"
import { useTokenAmountToCurrencyValue } from "../../accountTokens/tokenPriceHooks"
import { useTokensInNetwork } from "../../accountTokens/tokens.state"
import { TransformedTransactionType } from "../transform/type"

const TitleCurrencyValue = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.text2};
`
interface ITransferTitle {
  type: TransformedTransactionType
  amount: string
  tokenAddress: string
  fallback?: string
}

export const TransferTitle: FC<ITransferTitle> = ({
  type,
  amount,
  tokenAddress,
  fallback,
}) => {
  const { switcherNetworkId } = useAppState()
  const tokensByNetwork = useTokensInNetwork(switcherNetworkId)
  const token = tokensByNetwork.find(({ address }) =>
    isEqualAddress(address, tokenAddress),
  )
  const amountCurrencyValue = useTokenAmountToCurrencyValue(token, amount)
  if (!token) {
    return <>{fallback}</>
  }
  const displayAmount = prettifyTokenAmount({
    amount,
    decimals: token?.decimals,
    symbol: token?.symbol || "Unknown token",
  })
  return (
    <>
      {type === "SEND" ? "–" : ""}
      {displayAmount}
      {amountCurrencyValue && (
        <TitleCurrencyValue>
          {" "}
          ({prettifyCurrencyValue(amountCurrencyValue)})
        </TitleCurrencyValue>
      )}
    </>
  )
}
