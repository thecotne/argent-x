import { FC } from "react"
import styled from "styled-components"

import {
  prettifyCurrencyValue,
  prettifyTokenAmount,
} from "../../../../../shared/token/price"
import { getFeeToken } from "../../../../../shared/token/utils"
import { Field, FieldKey, LeftPaddedField } from "../../../../components/Fields"
import { useTokenAmountToCurrencyValue } from "../../../accountTokens/tokenPriceHooks"

const FeeAmount = styled.div`
  text-align: right;
`
const FeeValue = styled.div`
  text-align: right;
  color: ${({ theme }) => theme.text2};
  font-size: 12px;
  line-height: 14px;
  margin-top: 2px;
`

export interface IFeeField {
  title?: string
  fee: string
  networkId: string
}

export const FeeField: FC<IFeeField> = ({
  title = "Network fee",
  fee,
  networkId,
}) => {
  const feeToken = getFeeToken(networkId)
  const amountCurrencyValue = useTokenAmountToCurrencyValue(feeToken, fee)
  if (!feeToken) {
    return null
  }
  return (
    <Field>
      <FieldKey>{title}</FieldKey>
      <LeftPaddedField>
        <FeeAmount>
          {prettifyTokenAmount({
            amount: fee,
            decimals: feeToken.decimals,
            symbol: feeToken.symbol,
          })}
        </FeeAmount>
        <FeeValue>{prettifyCurrencyValue(amountCurrencyValue)}</FeeValue>
      </LeftPaddedField>
    </Field>
  )
}
