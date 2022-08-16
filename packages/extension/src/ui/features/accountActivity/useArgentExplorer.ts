import urlJoin from "url-join"

import {
  ARGENT_EXPLORER_BASE_URL,
  ARGENT_EXPLORER_ENABLED,
} from "../../../shared/api/constants"
import { IExplorerTransaction } from "../../../shared/explorer/type"
import {
  isPrivacySettingsEnabled,
  settingsStore,
} from "../../../shared/settings"
import { useKeyValueStorage } from "../../../shared/storage/hooks"
import { useConditionallyEnabledSWR } from "../../services/swr"
import { useArgentApiFetcher } from "../../services/useArgentApiFetcher"

export const useArgentExplorerEnabled = () => {
  const privacyUseArgentServices = useKeyValueStorage(
    settingsStore,
    "privacyUseArgentServices",
  )
  /** ignore `privacyUseArgentServices` entirely when the Privacy Settings UI is disabled */
  if (!isPrivacySettingsEnabled) {
    return ARGENT_EXPLORER_ENABLED
  }
  return ARGENT_EXPLORER_ENABLED && privacyUseArgentServices
}

export const useArgentExplorerTransaction = (txHash?: string) => {
  const fetcher = useArgentApiFetcher()
  const argentExplorerEnabled = useArgentExplorerEnabled()
  console.log({ argentExplorerEnabled })
  const { data: explorerTransaction } =
    useConditionallyEnabledSWR<IExplorerTransaction>(
      argentExplorerEnabled,
      txHash && urlJoin(ARGENT_EXPLORER_BASE_URL, `transactions/${txHash}`),
      fetcher,
    )
  return explorerTransaction
}
