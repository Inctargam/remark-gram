import { useEffect, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'

import { useCitiesQuery, useCountriesQuery } from '@/entities/location'
import type { Profile } from '@/entities/profile'
import type { ComboboxOption } from '@/shared/ui/combobox'

import type { EditProfileFormValues } from './editProfileFormValues'

type Params = {
  control: Control<EditProfileFormValues>
  profile: Profile | undefined
}

export const useProfileLocationFields = ({ control, profile }: Params) => {
  const { field: countryField } = useController({ control, name: 'country' })
  const { field: cityField } = useController({ control, name: 'city' })
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [debouncedCountrySearch, setDebouncedCountrySearch] = useState('')
  const [selectedCountryOption, setSelectedCountryOption] = useState<ComboboxOption | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedCountrySearch(countrySearch.trim()), 250)

    return () => window.clearTimeout(timeout)
  }, [countrySearch])

  const countriesQuery = useCountriesQuery(debouncedCountrySearch, isCountryOpen)
  const countries = countriesQuery.data ?? []
  const selectedCountryCode = countryField.value || null
  const citiesQuery = useCitiesQuery(selectedCountryCode)
  const cities = citiesQuery.data ?? []
  const cityNames = [...new Set(cities.map((city) => city.name))]

  const countryOptions: ComboboxOption[] = countries.map((country) => ({
    label: country.name,
    value: country.code,
  }))
  if (
    selectedCountryCode &&
    !countryOptions.some((option) => option.value === selectedCountryCode)
  ) {
    const selectedName =
      selectedCountryOption?.value === selectedCountryCode
        ? selectedCountryOption.label
        : profile?.countryCode === selectedCountryCode
          ? profile.country
          : selectedCountryCode

    countryOptions.unshift({ label: selectedName, value: selectedCountryCode })
  }

  const cityOptions: ComboboxOption[] = cityNames.map((name) => ({
    label: name,
    value: name,
  }))
  if (cityField.value && !cityOptions.some((option) => option.value === cityField.value)) {
    cityOptions.unshift({ label: cityField.value, value: cityField.value })
  }

  const countryValueChangeHandler = (countryCode: string | null) => {
    if (countryCode === selectedCountryCode) {
      return
    }

    const country = countries.find((item) => item.code === countryCode)
    setSelectedCountryOption(country ? { label: country.name, value: country.code } : null)

    countryField.onChange(country?.code ?? '')
    cityField.onChange('')
  }

  const cityValueChangeHandler = (cityName: string | null) => {
    if (cityName === cityField.value) {
      return
    }

    cityField.onChange(cityName ?? '')
  }

  const hasSelectedCountry = Boolean(selectedCountryCode)
  const countryError = countriesQuery.isError ? 'Failed to load countries' : undefined
  const cityError = citiesQuery.isError ? 'Failed to load cities' : undefined

  return {
    country: {
      error: countryError,
      onBlur: countryField.onBlur,
      onValueChange: countryValueChangeHandler,
      onOpenChange: setIsCountryOpen,
      onSearchChange: setCountrySearch,
      options: countryOptions,
      value: selectedCountryCode,
      remoteSearch: true,
    },
    city: {
      disabled: !hasSelectedCountry || citiesQuery.isError,
      emptyMessage: citiesQuery.isSuccess ? 'No Results' : null,
      error: cityError,
      limit: 50,
      onBlur: cityField.onBlur,
      onValueChange: cityValueChangeHandler,
      options: cityOptions,
      value: cityField.value || null,
    },
  }
}
