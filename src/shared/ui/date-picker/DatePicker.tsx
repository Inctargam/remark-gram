import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { Icon } from '../icon'
import { Calendar } from './Calendar'
import styles from './datePicker.module.css'

type DatePickerMode = 'single' | 'range'

export type DatePickerProps = {
  mode?: DatePickerMode
  label?: string
  error?: string
  className?: string
  disabled?: boolean
  placeholder?: string
  defaultOpen?: boolean
  value?: Date | { from: Date; to: Date } | undefined
  onChange?: (value: Date | { from: Date; to: Date } | undefined) => void
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatValue = (value: Date | { from: Date; to: Date } | undefined): string => {
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
  error,
  className,
  disabled,
  placeholder = 'Select date',
  defaultOpen = false,
  value,
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const [internalValue, setInternalValue] = useState<Date | { from: Date; to: Date } | undefined>(
    value
  )
  const [selectedUnderError, setSelectedUnderError] = useState<string | undefined>()
  const rootRef = useRef<HTMLDivElement>(null)

  const isControlled = value !== undefined
  const selected = isControlled ? value : internalValue
  const isRange = mode === 'range'
  const displayError = error !== selectedUnderError ? error : undefined
  const isError = Boolean(displayError)
  const displayValue = formatValue(selected || new Date())

  useEffect(() => {
    if (!open) return

    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const close = () => setOpen(false)

  const handleSelect = (date: Date) => {
    onChange?.(date)
    if (!isControlled) {
      setInternalValue(date)
    }
    close()
  }

  const handleRangeSelect = (range: { from: Date; to: Date }) => {
    onChange?.(range)
    if (!isControlled) {
      setInternalValue(range)
    }
    if (range.from.getTime() !== range.to.getTime()) {
      close()
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
              setOpen((prev) => !prev)
              setSelectedUnderError(error)
            }
          }}
          aria-expanded={open}
          aria-label={label || placeholder}>
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
              selected={mode === 'single' ? (selected as Date) : undefined}
              rangeSelected={mode === 'range' ? (selected as { from: Date; to: Date }) : undefined}
              onSelect={handleSelect}
              onRangeSelect={handleRangeSelect}
            />
          </div>
        )}
      </div>

      {displayError && <span className={styles.error}>{displayError}</span>}
    </div>
  )
}
