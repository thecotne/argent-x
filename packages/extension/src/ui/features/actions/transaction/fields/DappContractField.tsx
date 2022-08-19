import { FC } from "react"
import styled from "styled-components"

import {
  KnownDapp,
  getKnownDappForContractAddress,
} from "../../../../../shared/knownDapps"
import {
  Field,
  FieldKey,
  FieldValue,
  LeftPaddedField,
} from "../../../../components/Fields"
import { DappIcon } from "../../connectDapp/DappIcon"
import { useDappDisplayAttributes } from "../../connectDapp/useDappDisplayAttributes"

const DappIconContainer = styled.div`
  width: 24px;
  height: 24px;
`

export const MaybeDappContractField: FC<{ contractAddress: string }> = ({
  contractAddress,
}) => {
  const knownContract = getKnownDappForContractAddress(contractAddress)
  if (!knownContract) {
    return null
  }
  return <DappContractField knownContract={knownContract} />
}

export const DappContractField: FC<{
  knownContract: Omit<KnownDapp, "contracts">
}> = ({ knownContract }) => {
  const dappDisplayAttributes = useDappDisplayAttributes(knownContract.host)
  return (
    <Field>
      <FieldKey>Dapp</FieldKey>
      <FieldValue>
        <DappIconContainer>
          <DappIcon host={knownContract.host} />
        </DappIconContainer>
        <LeftPaddedField>
          {dappDisplayAttributes?.title || knownContract.host}
        </LeftPaddedField>
      </FieldValue>
    </Field>
  )
}
