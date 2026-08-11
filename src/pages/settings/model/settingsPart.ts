export const SETTINGS_PARTS = {
  info: 'info',
  devices: 'devices',
  subscriptions: 'subscriptions',
  payments: 'payments',
} as const

export type SettingsPart = (typeof SETTINGS_PARTS)[keyof typeof SETTINGS_PARTS]

export const DEFAULT_SETTINGS_PART = SETTINGS_PARTS.info

export const isSettingsPart = (part: string | string[] | undefined): part is SettingsPart => {
  return typeof part === 'string' && Object.values(SETTINGS_PARTS).includes(part as SettingsPart)
}
