import { Field } from '@base-ui/react/field'
import clsx from 'clsx'

import styles from './textArea.module.css'

export type TextAreaProps = {
  className?: string
  error?: string
  label: string
} & Omit<Field.Control.Props, 'className' | 'render'>

export const TextArea = ({
  className,
  disabled,
  error,
  label,
  placeholder = 'Text-area',
  ...props
}: TextAreaProps) => {
  const isInvalid = Boolean(error)

  return (
    <Field.Root className={clsx(styles.root, className)} disabled={disabled} invalid={isInvalid}>
      <Field.Label className={styles.label}>{label}</Field.Label>
      <Field.Control
        {...props}
        className={styles.textarea}
        placeholder={placeholder}
        render={<textarea />}
      />
      {error && (
        <Field.Error className={styles.error} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  )
}
