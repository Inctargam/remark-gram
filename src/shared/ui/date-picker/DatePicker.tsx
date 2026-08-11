import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Icon } from '../icon'
import { Calendar } from './Calendar'
import styles from './datePicker.module.css'

type DatePickerMode = 'single' | 'range'

export type DatePickerProps = {
  mode?: DatePickerMode
  label?: ReactNode
  ariaLabel?: string
  error?: ReactNode
  className?: string
  disabled?: boolean
  placeholder?: string
  defaultOpen?: boolean
  value?: Date | { from: Date; to: Date } | null
  onChange?: (value: Date | { from: Date; to: Date } | undefined) => void
  onBlur?: () => void
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatValue = (value: Date | { from: Date; to: Date } | null | undefined): string => {
  if (!value) return ''
  if (value instanceof Date) return formatDate(value)
  if (value.from && value.to) {
    return `${formatDate(value.from)} - ${formatDate(value.to)}`
  }
  if (value.from) return formatDate(value.from)
  return ''
}

export const DatePicker = ({
  mode = 'single',
  label,
  ariaLabel,
  error,
  className,
  disabled,
  placeholder = 'Select date',
  defaultOpen = false,
  value,
  onChange,
  onBlur,
}: DatePickerProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const [internalValue, setInternalValue] = useState<
    Date | { from: Date; to: Date } | null | undefined
  >(value)
  const [selectedUnderError, setSelectedUnderError] = useState<ReactNode>()
  const rootRef = useRef<HTMLDivElement>(null)

  const isControlled = value !== undefined
  const selected = isControlled ? value : internalValue
  const isRange = mode === 'range'
  const displayError = error !== selectedUnderError ? error : undefined
  const isError = Boolean(displayError)
  const displayValue = formatValue(selected)
  const accessibleLabel = ariaLabel ?? (typeof label === 'string' ? label : placeholder)

  useEffect(() => {
    if (!open) return

    const outsideClickHandler = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
        onBlur?.()
      }
    }

    document.addEventListener('mousedown', outsideClickHandler)
    return () => document.removeEventListener('mousedown', outsideClickHandler)
  }, [onBlur, open])

  const closeHandler = () => {
    setOpen(false)
    onBlur?.()
  }

  const selectHandler = (date: Date) => {
    onChange?.(date)
    if (!isControlled) {
      setInternalValue(date)
    }
    closeHandler()
  }

  const rangeSelectHandler = (range: { from: Date; to: Date }) => {
    onChange?.(range)
    if (!isControlled) {
      setInternalValue(range)
    }
    if (range.from.getTime() !== range.to.getTime()) {
      closeHandler()
    }
  }

  const triggerClasses = clsx(
    styles.trigger,
    isRange && styles.triggerRange,
    isError && styles.triggerError
  )
  const iconClasses = clsx(styles.icon, isError && styles.iconError)

  return (
    <div ref={rootRef} className={clsx(styles.root, className)}>
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.triggerWrapper}>
        <button
          type="button"
          className={triggerClasses}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setOpen((previousOpen) => {
                if (previousOpen) {
                  onBlur?.()
                }

                return !previousOpen
              })
              setSelectedUnderError(error)
            }
          }}
          aria-expanded={open}
          aria-label={accessibleLabel}>
          <span
            className={clsx(
              styles.value,
              !displayValue && styles.placeholder,
              isError && styles.valueError
            )}>
            {displayValue || placeholder}
          </span>
          <Icon iconId="icon-calendar-outline" width={24} height={24} className={iconClasses} />
        </button>

        {open && (
          <div className={styles.popup}>
            <Calendar
              mode={mode}
              initialMonth={selected instanceof Date ? selected : undefined}
              selected={mode === 'single' ? (selected as Date) : undefined}
              rangeSelected={mode === 'range' ? (selected as { from: Date; to: Date }) : undefined}
              onSelect={selectHandler}
              onRangeSelect={rangeSelectHandler}
            />
          </div>
        )}
      </div>

      {displayError && <span className={styles.error}>{displayError}</span>}
    </div>
  )
}
