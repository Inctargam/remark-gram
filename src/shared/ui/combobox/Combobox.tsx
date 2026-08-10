import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import clsx from 'clsx'
import { useId, useState } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './Combobox.module.css'

export type ComboboxOption = {
  value: string
  label: string
  description?: string
}

export type ComboboxProps = {
  options: readonly ComboboxOption[]
  value: string | null
  onValueChange: (value: string | null) => void
  onBlur?: () => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  emptyMessage?: string | null
  limit?: number
  className?: string
}

export const Combobox = ({
  options,
  value,
  onValueChange,
  onBlur,
  label,
  placeholder = 'Select...',
  disabled = false,
  error,
  emptyMessage = 'No Results',
  limit,
  className,
}: ComboboxProps) => {
  const inputId = useId()
  const messageId = useId()
  const [query, setQuery] = useState<string | null>(null)
  const selectedOption = options.find((option) => option.value === value) ?? null
  const filter = BaseCombobox.useFilter({ sensitivity: 'base' })
  const inputValue = query ?? selectedOption?.label ?? ''

  const valueChangeHandler = (option: ComboboxOption | null) => {
    setQuery(null)
    onValueChange(option?.value ?? null)
  }

  const blurHandler = () => {
    if (inputValue.trim() === '') {
      onValueChange(null)
    }

    setQuery(null)
    onBlur?.()
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <BaseCombobox.Root
        autoHighlight
        disabled={disabled}
        filter={filter.startsWith}
        isItemEqualToValue={(option, selectedValue) => option.value === selectedValue.value}
        itemToStringLabel={(option) => option.label}
        items={options}
        inputValue={inputValue}
        limit={limit}
        onInputValueChange={setQuery}
        onValueChange={valueChangeHandler}
        openOnInputClick={false}
        value={selectedOption}>
        <BaseCombobox.InputGroup className={styles.inputGroup}>
          <BaseCombobox.Input
            aria-describedby={error ? messageId : undefined}
            aria-invalid={Boolean(error)}
            className={styles.input}
            id={inputId}
            onBlur={blurHandler}
            placeholder={placeholder}
          />
          <BaseCombobox.Trigger
            aria-label={label ? `Show ${label} options` : 'Show options'}
            className={styles.trigger}>
            <BaseCombobox.Icon className={styles.icon}>
              <Icon iconId="icon-arrow-ios-down-outline" width={16} height={16} />
            </BaseCombobox.Icon>
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>

        <BaseCombobox.Portal>
          <BaseCombobox.Positioner align="start" className={styles.positioner} sideOffset={0}>
            <BaseCombobox.Popup className={styles.popup}>
              {emptyMessage && (
                <BaseCombobox.Empty className={styles.empty}>{emptyMessage}</BaseCombobox.Empty>
              )}
              <BaseCombobox.List className={styles.list}>
                {(option: ComboboxOption) => (
                  <BaseCombobox.Item className={styles.item} key={option.value} value={option}>
                    <span>{option.label}</span>
                    {option.description && (
                      <span className={styles.description}>{option.description}</span>
                    )}
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>

      {error && (
        <span className={clsx(styles.feedback, styles.error)} id={messageId}>
          {error}
        </span>
      )}
    </div>
  )
}
