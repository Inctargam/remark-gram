import { Field } from '@base-ui/react/field'
import type { InputProps as BaseInputProps } from '@base-ui/react/input'
import { Input as BaseInput } from '@base-ui/react/input'
import clsx from 'clsx'
import { useState } from 'react'

import { Icon } from '../icon'
import styles from './input.module.css'

export type InputProps = {
  label?: string
  error?: string
  className?: string
} & Omit<BaseInputProps, 'className'>

export const Input = ({ label, error, className, disabled, type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const isSearch = type === 'search'
  const isInvalid = Boolean(error)
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <Field.Root className={clsx(styles.root, className)} disabled={disabled} invalid={isInvalid}>
      {label && <Field.Label className={styles.label}>{label}</Field.Label>}
      <div
        className={clsx(styles.inputWrapper, isSearch && styles.searchWrapper)}
        data-disabled={isSearch ? disabled || undefined : undefined}
        data-invalid={isSearch ? error || undefined : undefined}>
        {isSearch && (
          <Icon iconId="icon-search-outline" width={20} height={20} className={styles.searchIcon} />
        )}
        <BaseInput
          className={clsx(
            isSearch ? styles.searchField : styles.field,
            isPassword && styles.fieldWithEndIcon
          )}
          type={resolvedType}
          disabled={disabled}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.endIcon}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}>
            <Icon iconId={showPassword ? 'icon-eye-off' : 'icon-eye'} />
          </button>
        )}
      </div>
      {error && (
        <Field.Error className={styles.error} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  )
}
