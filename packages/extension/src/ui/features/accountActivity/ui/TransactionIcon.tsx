import { FC } from "react"
import styled from "styled-components"

import { TransactionArgentX } from "../../../components/Icons/TransactionArgentX"
import { TransactionNFT } from "../../../components/Icons/TransactionNFT"
import { TransactionReceive } from "../../../components/Icons/TransactionReceive"
import { TransactionSend } from "../../../components/Icons/TransactionSend"
import { TransactionSwap } from "../../../components/Icons/TransactionSwap"
import { TransactionUnknown } from "../../../components/Icons/TransactionUnknown"
import { getTokenIconUrl } from "../../accountTokens/TokenIcon"
import { DappIcon } from "../../actions/connectDapp/DappIcon"
import { TransformedTransaction } from "../transform/type"

const Container = styled.div<{
  size: number
  outline?: boolean
}>`
  font-size: ${({ size }) => size}px;
  width: 1em;
  height: 1em;
  border-radius: 500px;
  background-color: ${({ theme }) => theme.black};
  position: relative;
  ${({ outline }) => (outline ? `border: 1px solid white;` : "")}
`

const TokenImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 500px; ;
`

const BadgeContainer = styled.div<{
  size: number
}>`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

export interface ITransactionIcon {
  transaction: TransformedTransaction
  size: number
  outline?: boolean
}

export const TransactionIcon: FC<ITransactionIcon> = ({
  transaction,
  size = 80,
  outline = false,
}) => {
  const badgeSize = Math.min(24, Math.round((size * 16) / 40))
  const { type, dapp, token, toToken } = transaction
  let iconComponent = <TransactionUnknown />
  let badgeComponent
  switch (type) {
    case "CREATE_ACCOUNT":
    case "UPGRADE_ACCOUNT":
      iconComponent = <TransactionArgentX />
      break
    case "SEND":
    case "SEND_ERC721":
      iconComponent = <TransactionSend />
      break
    case "RECEIVE":
    case "RECEIVE_ERC721":
      iconComponent = <TransactionReceive />
      break
    case "TRANSFER":
    case "TRANSFER_ERC721":
      iconComponent = <TransactionSend />
      break
    case "SWAP":
      iconComponent = <TransactionSwap />
      break
    case "MINT":
      iconComponent = <TransactionReceive />
      break
    case "MINT_ERC721":
    case "BUY_ERC721":
      iconComponent = <TransactionNFT />
      break
  }
  if (token) {
    const src = getTokenIconUrl({
      url: token.image,
      name: token.name,
    })
    badgeComponent = <TokenImage src={src} />
  } else if (toToken) {
    const src = getTokenIconUrl({
      url: toToken.image,
      name: toToken.name,
    })
    badgeComponent = <TokenImage src={src} />
  } else if (dapp) {
    badgeComponent = <DappIcon host={dapp.host} />
  }
  return (
    <Container size={size} outline={outline}>
      {iconComponent}
      <BadgeContainer size={badgeSize}>{badgeComponent}</BadgeContainer>
    </Container>
  )
}
