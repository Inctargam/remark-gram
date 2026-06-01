'use client'

import type { SelectRootProps } from '@base-ui/react/select'
import { Select as BaseSelect } from '@base-ui/react/select'
import clsx from 'clsx'

import { Icon } from '@/shared/ui/icon'

import styles from './Select.module.css'

export type SelectOption<T = string> = {
  label: string
  value: T
}

export type SelectProps<T extends string | number = string> = Omit<
  SelectRootProps<T, false>,
  'children'
> & {
  options: SelectOption<T>[]
  placeholder?: string
  label?: string
  className?: string
}

export const Select = <T extends string | number = string>({
  options,
  placeholder = 'Select...',
  label,
  className,
  ...rootProps
}: SelectProps<T>) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <BaseSelect.Root {...rootProps}>
        <BaseSelect.Trigger className={styles.trigger}>
          <BaseSelect.Value className={styles.value} placeholder={placeholder} />
          <BaseSelect.Icon className={styles.icon}>
            <Icon iconId="icon-arrow-ios-down-outline" width={16} height={16} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner alignItemWithTrigger={false}>
            <BaseSelect.Popup className={styles.popup}>
              {options.map((option) => (
                <BaseSelect.Item
                  key={String(option.value)}
                  value={option.value}
                  className={styles.item}>
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  )
}
