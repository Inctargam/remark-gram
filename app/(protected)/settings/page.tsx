import { redirect } from 'next/navigation'

import { DEFAULT_SETTINGS_PART, isSettingsPart, SettingsPage } from '@/pages/settings'
import { ROUTES } from '@/shared/config'

type Props = {
  searchParams: Promise<{
    part?: string | string[]
  }>
}

export default async function Page({ searchParams }: Props) {
  const { part } = await searchParams

  if (!isSettingsPart(part)) {
    redirect(`${ROUTES.settings}?part=${DEFAULT_SETTINGS_PART}`)
  }

  return <SettingsPage activePart={part} />
}
