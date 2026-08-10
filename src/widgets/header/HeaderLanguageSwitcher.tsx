'use client'

import Image from 'next/image'

import type { SelectOption } from '@/shared/ui/select'
import { Select } from '@/shared/ui/select'

import styles from './headerLanguageSwitcher.module.css'

export type HeaderLanguage = 'en' | 'ru'

type Props = {
  compact?: boolean
  value: HeaderLanguage
  onValueChange: (value: HeaderLanguage) => void
}

const LANGUAGES = {
  en: { flag: '/icons/flag-uk.svg', label: 'English', shortLabel: 'EN' },
  ru: { flag: '/icons/flag-ru.svg', label: 'Russian', shortLabel: 'RU' },
} as const

const LANGUAGE_OPTIONS: SelectOption<HeaderLanguage>[] = [
  { label: LANGUAGES.en.label, value: 'en' },
  { label: LANGUAGES.ru.label, value: 'ru' },
]

export const HeaderLanguageSwitcher = ({ compact = false, value, onValueChange }: Props) => {
  return (
    <Select
      className={compact ? styles.compactRoot : styles.root}
      modal={false}
      options={LANGUAGE_OPTIONS}
      placeholder={`Language: ${LANGUAGES[value].label}`}
      popupClassName={compact ? styles.compactPopup : undefined}
      renderOption={({ value: optionValue }) => {
        const language = LANGUAGES[optionValue]

        return (
          <span className={styles.optionContent}>
            <Image alt="" className={styles.flag} height={24} src={language.flag} width={24} />
            <span>{compact ? language.shortLabel : language.label}</span>
          </span>
        )
      }}
      renderValue={(selectedValue) => {
        if (!selectedValue) {
          return null
        }

        const language = LANGUAGES[selectedValue]

        return (
          <span className={styles.valueContent}>
            <Image alt="" className={styles.flag} height={24} src={language.flag} width={24} />
            {!compact && <span>{language.label}</span>}
          </span>
        )
      }}
      triggerClassName={compact ? styles.compactTrigger : undefined}
      value={value}
      onValueChange={(selectedValue) => {
        if (selectedValue) {
          onValueChange(selectedValue)
        }
      }}
    />
  )
}
