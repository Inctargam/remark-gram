import { Radio } from '@base-ui/react/radio'
import type { RadioGroupProps as BaseRadioGroupProps } from '@base-ui/react/radio-group'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './radioGroup.module.css'

type Direction = 'horizontal' | 'vertical'

export type RadioGroupOption<Value extends string = string> = {
  disabled?: boolean
  label: ReactNode
  value: Value
}

export type RadioGroupProps<Value extends string = string> = {
  className?: string
  direction?: Direction
  indicatorClassName?: string
  itemClassName?: string
  labelClassName?: string
  options: RadioGroupOption<Value>[]
  radioClassName?: string
} & Omit<BaseRadioGroupProps<Value>, 'children' | 'className'>

export const RadioGroup = <Value extends string = string>({
  className,
  direction = 'vertical',
  indicatorClassName,
  itemClassName,
  labelClassName,
  options,
  radioClassName,
  ...props
}: RadioGroupProps<Value>) => (
  <BaseRadioGroup className={clsx(styles.group, styles[direction], className)} {...props}>
    {options.map(({ disabled, label, value }) => (
      <label
        className={clsx(styles.item, itemClassName)}
        data-disabled={disabled || props.disabled ? '' : undefined}
        key={value}>
        <Radio.Root
          className={clsx(styles.radio, radioClassName)}
          disabled={disabled}
          value={value}>
          <svg aria-hidden="true" className={styles.icon} focusable="false" viewBox="0 0 24 24">
            <circle className={styles.ring} cx="12" cy="12" r="9" />
            <circle className={clsx(styles.indicator, indicatorClassName)} cx="12" cy="12" r="5" />
          </svg>
        </Radio.Root>
        <span className={clsx(styles.label, labelClassName)}>{label}</span>
      </label>
    ))}
  </BaseRadioGroup>
)
