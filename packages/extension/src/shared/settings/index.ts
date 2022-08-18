export const isPrivacySettingsEnabled =
  (process.env.FEATURE_PRIVACY_SETTINGS || "false") === "true"

export { settingsStore } from "./store"
