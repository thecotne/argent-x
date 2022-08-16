import { FC } from "react"

import { Field, FieldKey, LeftPaddedField } from "../../../../components/Fields"
import { PrettyAccountAddress } from "../../../accounts/PrettyAccountAddress"

interface IAccountAddressField {
  title: string
  accountAddress: string
  networkId: string
}

export const AccountAddressField: FC<IAccountAddressField> = ({
  title,
  accountAddress,
  networkId,
}) => {
  return (
    <Field>
      <FieldKey>{title}</FieldKey>
      <LeftPaddedField>
        <PrettyAccountAddress
          small
          accountAddress={accountAddress}
          networkId={networkId}
        />
      </LeftPaddedField>
    </Field>
  )
}
