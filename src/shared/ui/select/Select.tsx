'use client'

import type { SelectRootProps } from '@base-ui/react/select'
import { Select as BaseSelect } from '@base-ui/react/select'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './Select.module.css'

export type SelectOption<T = string> = {
  label: string
  value: T
}

export type SelectProps<T extends string | number = string> = Omit<
  SelectRootProps<T>,
  'children'
> & {
  options: SelectOption<T>[]
  placeholder?: string
  label?: string
  className?: string
  triggerClassName?: string
  popupClassName?: string
  renderOption?: (option: SelectOption<T>) => ReactNode
  renderValue?: (value: T | null) => ReactNode
}

export const Select = <T extends string | number = string>({
  options,
  placeholder = 'Select...',
  label,
  className,
  triggerClassName,
  popupClassName,
  renderOption,
  renderValue,
  ...rootProps
}: SelectProps<T>) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <BaseSelect.Root {...rootProps}>
        <BaseSelect.Trigger
          className={clsx(styles.trigger, triggerClassName)}
          aria-label={label ?? placeholder}>
          <BaseSelect.Value className={styles.value} placeholder={placeholder}>
            {renderValue}
          </BaseSelect.Value>
          <BaseSelect.Icon className={styles.icon}>
            <Icon iconId="icon-arrow-ios-down-outline" width={16} height={16} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner className={styles.positioner} alignItemWithTrigger={false}>
            <BaseSelect.Popup className={clsx(styles.popup, popupClassName)}>
              {options.map((option) => (
                <BaseSelect.Item
                  key={String(option.value)}
                  label={option.label}
                  value={option.value}
                  className={styles.item}>
                  <BaseSelect.ItemText>
                    {renderOption?.(option) ?? option.label}
                  </BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  )
}
