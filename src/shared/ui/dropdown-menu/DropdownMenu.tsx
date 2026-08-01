'use client'

import { Menu } from '@base-ui/react/menu'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './DropdownMenu.module.css'

export type DropdownMenuItem = {
  /** Stable key for React and for targeting the item in tests. Not rendered. */
  id: string
  label: string
  /** Sprite icon id, e.g. 'icon-edit-2-outline'. */
  iconId?: string
  onSelect: () => void
  disabled?: boolean
  /** Renders the item in the danger color — for destructive actions. */
  danger?: boolean
}

type Props = {
  items: DropdownMenuItem[]
  /**
   * Accessible name of the trigger button.
   * Required: the default trigger is icon-only and has no text to name it.
   */
  ariaLabel: string
  /** Trigger content. The trigger element itself is always a <button>. */
  trigger?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  /** Controlled mode. Omit both props to let the menu manage its own state. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Class for the popup. */
  className?: string
  triggerClassName?: string
}

export type { Props as DropdownMenuProps }

export const DropdownMenu = ({
  items,
  ariaLabel,
  trigger,
  side = 'bottom',
  align = 'end',
  sideOffset = 4,
  open,
  onOpenChange,
  className,
  triggerClassName,
}: Props) => (
  // BaseUI passes eventDetails as a second argument — we drop it, callers only need the flag.
  <Menu.Root open={open} onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}>
    <Menu.Trigger className={clsx(styles.trigger, triggerClassName)} aria-label={ariaLabel}>
      {trigger ?? <Icon iconId="icon-more-horizontal" width={24} height={24} />}
    </Menu.Trigger>

    <Menu.Portal>
      <Menu.Positioner side={side} align={align} sideOffset={sideOffset}>
        <Menu.Popup className={clsx(styles.popup, className)}>
          {items.map(({ id, label, iconId, onSelect, disabled, danger }) => (
            <Menu.Item
              key={id}
              className={clsx(styles.item, danger && styles.danger)}
              disabled={disabled}
              onClick={onSelect}>
              {iconId && (
                <Icon className={styles.itemIcon} iconId={iconId} width={24} height={24} />
              )}
              <span>{label}</span>
            </Menu.Item>
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
)
