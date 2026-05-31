import type { ScrollAreaRootProps } from '@base-ui/react/scroll-area'
import { ScrollArea } from '@base-ui/react/scroll-area'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './scroll.module.css'

type Orientation = 'vertical' | 'horizontal' | 'both'

export type ScrollProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
  fade?: boolean
  orientation?: Orientation
  viewportClassName?: string
} & Omit<ScrollAreaRootProps, 'children' | 'className'>

export const Scroll = ({
  children,
  className,
  contentClassName,
  fade = false,
  orientation = 'vertical',
  viewportClassName,
  ...props
}: ScrollProps) => {
  const hasHorizontalScrollbar = orientation === 'horizontal' || orientation === 'both'
  const hasVerticalScrollbar = orientation === 'vertical' || orientation === 'both'

  return (
    <ScrollArea.Root
      className={clsx(styles.root, fade && styles.fade, className)}
      overflowEdgeThreshold={8}
      {...props}>
      <ScrollArea.Viewport className={clsx(styles.viewport, viewportClassName)}>
        <ScrollArea.Content className={clsx(styles.content, contentClassName)}>
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      {hasVerticalScrollbar && (
        <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
          <ScrollArea.Thumb className={styles.thumb} />
        </ScrollArea.Scrollbar>
      )}

      {hasHorizontalScrollbar && (
        <ScrollArea.Scrollbar className={styles.scrollbar} orientation="horizontal">
          <ScrollArea.Thumb className={styles.thumb} />
        </ScrollArea.Scrollbar>
      )}

      {hasHorizontalScrollbar && hasVerticalScrollbar && (
        <ScrollArea.Corner className={styles.corner} />
      )}
    </ScrollArea.Root>
  )
}
