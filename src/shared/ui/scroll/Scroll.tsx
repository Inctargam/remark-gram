import type { ScrollAreaRootProps } from '@base-ui/react/scroll-area'
import { ScrollArea } from '@base-ui/react/scroll-area'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './scroll.module.css'

type Orientation = 'vertical' | 'horizontal' | 'both'

export type ScrollProps = {
  children: ReactNode
  className?: string
  orientation?: Orientation
} & Omit<ScrollAreaRootProps, 'children' | 'className'>

export const Scroll = ({
  children,
  className,
  orientation = 'vertical',
  ...props
}: ScrollProps) => {
  const hasHorizontalScrollbar = orientation === 'horizontal' || orientation === 'both'
  const hasVerticalScrollbar = orientation === 'vertical' || orientation === 'both'

  return (
    <ScrollArea.Root className={clsx(styles.root, className)} overflowEdgeThreshold={8} {...props}>
      <ScrollArea.Viewport className={styles.viewport}>
        <ScrollArea.Content className={styles.content}>{children}</ScrollArea.Content>
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
