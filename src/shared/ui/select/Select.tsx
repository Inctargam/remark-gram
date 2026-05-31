import { Select as BaseSelect } from '@base-ui/react/select'
import type { SelectRootProps } from '@base-ui/react/select'
import clsx from 'clsx'

import styles from './Select.module.css'

export type SelectOption = {
  label: string
  value: string
}

export type SelectProps = Omit<SelectRootProps<string, false>, 'children'> & {
  options: SelectOption[]
  label?: string
  placeholder?: string
  className?: string
}

export const Select = ({
  options,
  label,
  placeholder = 'Select...',
  className,
  ...rootProps
}: SelectProps) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <BaseSelect.Root {...rootProps}>
        <BaseSelect.Trigger className={styles.trigger}>
          <BaseSelect.Value placeholder={placeholder} />
          <BaseSelect.Icon className={styles.icon}>▼</BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Positioner className={styles.positioner}>
          <BaseSelect.Popup className={styles.popup}>
            <BaseSelect.List className={styles.list}>
              {options.map((option) => (
                <BaseSelect.Item key={option.value} value={option.value} className={styles.item}>
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Root>
    </div>
  )
}
