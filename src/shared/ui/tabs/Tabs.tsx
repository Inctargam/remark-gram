import type { Tabs as BaseTabsType } from '@base-ui/react/tabs'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import clsx from 'clsx'

import styles from './tabs.module.css'

export type TabsRootProps = {
  className?: string
} & Omit<BaseTabsType.Root.Props, 'className'>

export type TabsListProps = {
  className?: string
} & Omit<BaseTabsType.List.Props, 'className'>

export type TabsTabProps = {
  className?: string
} & Omit<BaseTabsType.Tab.Props, 'className'>

export type TabsIndicatorProps = {
  className?: string
} & Omit<BaseTabsType.Indicator.Props, 'className'>

export type TabsPanelProps = {
  className?: string
} & Omit<BaseTabsType.Panel.Props, 'className'>

const TabsRoot = ({ className, ...props }: TabsRootProps) => (
  <BaseTabs.Root className={clsx(styles.root, className)} {...props} />
)

const TabsList = ({ className, ...props }: TabsListProps) => (
  <BaseTabs.List className={clsx(styles.list, className)} {...props} />
)

const TabsTab = ({ className, ...props }: TabsTabProps) => (
  <BaseTabs.Tab className={clsx(styles.tab, className)} {...props} />
)

const TabsIndicator = ({ className, ...props }: TabsIndicatorProps) => (
  <BaseTabs.Indicator className={clsx(styles.indicator, className)} {...props} />
)

const TabsPanel = ({ className, ...props }: TabsPanelProps) => (
  <BaseTabs.Panel className={clsx(styles.panel, className)} {...props} />
)

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
}
