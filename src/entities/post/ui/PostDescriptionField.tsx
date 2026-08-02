'use client'

import clsx from 'clsx'
import type { ChangeEvent } from 'react'

import { TextArea } from '@/shared/ui/textarea'

import { normalizePostDescription, POST_DESCRIPTION_MAX_LENGTH } from '../model/postDescription'
import styles from './postDescriptionField.module.css'

type Props = {
  /** Wording differs between creating and editing, the field itself does not. */
  label: string
  value: string
  disabled?: boolean
  /** Class for the field: screens differ in the height they give the textarea. */
  className?: string
  /** Receives the value already capped to the limit. */
  onChange: (description: string) => void
}

/**
 * Description input with its character counter.
 * Creating and editing a post share the limit, the placeholder and the counter,
 * so the field is owned by the entity rather than copied into both features.
 */
export const PostDescriptionField = ({ label, value, disabled, className, onChange }: Props) => {
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(normalizePostDescription(event.currentTarget.value))
  }

  return (
    <>
      <TextArea
        className={clsx(styles.field, className)}
        label={label}
        maxLength={POST_DESCRIPTION_MAX_LENGTH}
        placeholder="Add publication description"
        value={value}
        disabled={disabled}
        onChange={changeHandler}
      />
      <p className={styles.counter}>
        {value.length}/{POST_DESCRIPTION_MAX_LENGTH}
      </p>
    </>
  )
}
