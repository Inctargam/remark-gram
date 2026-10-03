import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import clsx from 'clsx'
import type { KeyboardEvent } from 'react'
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
  /** Keeps the selected label available outside the search results. */
  selectedOption?: ComboboxOption | null
  onValueChange: (value: string | null) => void
  onBlur?: () => void
  onSearchChange?: (query: string) => void
  onOpenChange?: (open: boolean) => void
  remoteSearch?: boolean
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
  selectedOption: selectedValueOption,
  onValueChange,
  onBlur,
  onSearchChange,
  onOpenChange,
  remoteSearch = false,
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
  const selectedOption =
    options.find((option) => option.value === value) ??
    (selectedValueOption?.value === value ? selectedValueOption : null)
  const filter = BaseCombobox.useFilter({ sensitivity: 'base' })
  const inputValue = query ?? selectedOption?.label ?? ''

  const valueChangeHandler = (option: ComboboxOption | null) => {
    setQuery(null)
    onSearchChange?.('')
    onValueChange(option?.value ?? null)
  }

  const inputValueChangeHandler = (value: string) => {
    setQuery(value)
    onSearchChange?.(value)
  }

  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const shouldSelectFirstOption =
      remoteSearch &&
      event.key === 'Enter' &&
      !event.currentTarget.hasAttribute('aria-activedescendant')

    if (shouldSelectFirstOption) {
      const popupId = event.currentTarget.getAttribute('aria-controls')
      const firstOption = popupId
        ? event.currentTarget.ownerDocument
            .getElementById(popupId)
            ?.querySelector<HTMLElement>('[role="option"]')
        : null

      if (firstOption) {
        event.preventDefault()
        firstOption.click()
      }
    }
  }

  const blurHandler = () => {
    if (inputValue.trim() === '') {
      onValueChange(null)
    }

    setQuery(null)
    onSearchChange?.('')
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
        filter={remoteSearch ? null : filter.startsWith}
        isItemEqualToValue={(option, selectedValue) => option.value === selectedValue.value}
        itemToStringLabel={(option) => option.label}
        items={options}
        inputValue={inputValue}
        limit={limit}
        onInputValueChange={inputValueChangeHandler}
        onOpenChange={onOpenChange}
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
            onKeyDown={keyDownHandler}
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
