import { useEffect, useRef } from 'react'

import type { SettingsPart } from '../model/settingsPart'

export const useActiveSettingsTabScroll = (activePart: SettingsPart) => {
  const tabsViewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeTab = tabsViewportRef.current?.querySelector<HTMLElement>(
      '[role="tab"][data-active]'
    )

    activeTab?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [activePart])

  return tabsViewportRef
}
