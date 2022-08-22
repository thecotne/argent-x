import { Collapse } from "@mui/material"
import { FC, useCallback, useMemo, useState } from "react"
import styled from "styled-components"

import { IExplorerTransaction } from "../../../shared/explorer/type"
import { CopyIconButton } from "../../components/CopyIconButton"
import { DisclosureIcon } from "../../components/DisclosureIcon"
import {
  Field,
  FieldGroup,
  FieldKey,
  FieldKeyGroup,
  FieldKeyMeta,
  FieldValue,
} from "../../components/Fields"
import { formatTruncatedAddress } from "../../services/addresses"
import { PrettyAccountAddress } from "../accounts/PrettyAccountAddress"
import { AccountAddressField } from "../actions/transaction/fields/AccountAddressField"
import { ContractField } from "../actions/transaction/fields/ContractField"
import { DappContractField } from "../actions/transaction/fields/DappContractField"
import { FeeField } from "../actions/transaction/fields/FeeField"
import { TransactionDetailWrapper } from "./TransactionDetailWrapper"
import { isErc20TransferTransaction, isNFTTransaction } from "./transform/is"
import { TransformedTransaction } from "./transform/type"
import { NFTTitle } from "./ui/NFTTitle"
import { TransactionIcon } from "./ui/TransactionIcon"
import { TransferTitle } from "./ui/TransferTitle"

const Date = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
`

const TransactionIconContainer = styled.div`
  margin-bottom: 8px;
`

const TitleAddressContainer = styled.div`
  font-size: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
`

const TitleAddressPrefix = styled.div`
  margin-right: 8px;
`

const TitleAddress = styled.div`
  font-weight: 600;
`

const StyledCopyIconButton = styled(CopyIconButton)`
  padding: 6px;
  margin-right: 4px;
`

const AddressNoWrap = styled.div`
  white-space: nowrap;
`

export interface IExplorerTransactionDetail {
  explorerTransaction: IExplorerTransaction
  explorerTransactionTransformed: TransformedTransaction
  networkId: string
}

export const ExplorerTransactionDetail: FC<IExplorerTransactionDetail> = ({
  explorerTransaction,
  explorerTransactionTransformed,
  networkId,
}) => {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = useCallback(() => {
    setExpanded((expanded) => !expanded)
  }, [])
  const {
    type,
    displayName,
    actualFee,
    fromAddress,
    toAddress,
    dapp,
    tokenAddress,
    contractAddress,
  } = explorerTransactionTransformed
  const isRejected = explorerTransaction.status === "REJECTED"
  const isNFT = isNFTTransaction(explorerTransactionTransformed)
  const title = useMemo(() => {
    if (isErc20TransferTransaction(explorerTransactionTransformed)) {
      const { amount, tokenAddress } = explorerTransactionTransformed
      return (
        <TransferTitle
          type={type}
          amount={amount}
          tokenAddress={tokenAddress}
          fallback={displayName}
        />
      )
    } else if (isNFT) {
      const { contractAddress, tokenId } = explorerTransactionTransformed
      /** ERC721 */
      return (
        <NFTTitle
          contractAddress={contractAddress}
          tokenId={tokenId}
          networkId={networkId}
          fallback={displayName}
        />
      )
    }
    return displayName
  }, [displayName, explorerTransactionTransformed, isNFT, networkId, type])
  const titleShowsTo =
    toAddress &&
    (type === "SEND" ||
      type === "SEND_ERC721" ||
      type === "TRANSFER" ||
      type === "TRANSFER_ERC721")
  const titleShowsFrom =
    fromAddress && (type === "RECEIVE" || type === "RECEIVE_ERC721")
  const displayContractAddress = formatTruncatedAddress(
    explorerTransaction.contractAddress,
  )
  return (
    <TransactionDetailWrapper
      title={
        <>
          {!isNFT && (
            <TransactionIconContainer>
              <TransactionIcon
                transaction={explorerTransactionTransformed}
                size={80}
                outline
              />
            </TransactionIconContainer>
          )}
          {title}
          {(titleShowsTo || titleShowsFrom) && (
            <TitleAddressContainer>
              <TitleAddressPrefix>
                {titleShowsTo ? "To:" : "From:"}
              </TitleAddressPrefix>
              <TitleAddress>
                <PrettyAccountAddress
                  accountAddress={titleShowsTo ? toAddress : fromAddress || ""}
                  networkId={networkId}
                  size={20}
                />
              </TitleAddress>
            </TitleAddressContainer>
          )}
          <Date>TODO: placeholder date in here</Date>
        </>
      }
    >
      <FieldGroup>
        <Field clickable onClick={toggleExpanded}>
          <TransactionIcon
            transaction={explorerTransactionTransformed}
            size={40}
          />
          <FieldKeyGroup>
            <FieldKey>Action</FieldKey>
            <FieldKeyMeta>{displayName}</FieldKeyMeta>
          </FieldKeyGroup>
          <FieldValue>
            <DisclosureIcon expanded={expanded} />
          </FieldValue>
        </Field>
        <Collapse in={expanded} timeout="auto">
          <Field>
            <FieldKey>Contract</FieldKey>
            <FieldValue>
              <StyledCopyIconButton
                copyValue={explorerTransaction.contractAddress}
              />{" "}
              <AddressNoWrap>{displayContractAddress}</AddressNoWrap>
            </FieldValue>
          </Field>
          <ContractField
            contractAddress={explorerTransaction.contractAddress}
          />
        </Collapse>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <FieldKey>Status</FieldKey>
          <FieldValue>{isRejected ? "Failed" : "Complete"}</FieldValue>
        </Field>
        {dapp && <DappContractField knownContract={dapp} />}
        {fromAddress && (
          <AccountAddressField
            title="From"
            accountAddress={fromAddress}
            networkId={networkId}
          />
        )}
        {toAddress && (
          <AccountAddressField
            title="To"
            accountAddress={toAddress}
            networkId={networkId}
          />
        )}
        {actualFee && <FeeField fee={actualFee} networkId={networkId} />}
      </FieldGroup>
      <pre>
        {JSON.stringify(
          {
            networkId,
            transformed: explorerTransactionTransformed,
            explorerTransaction,
          },
          null,
          2,
        )}
      </pre>
    </TransactionDetailWrapper>
  )
}
