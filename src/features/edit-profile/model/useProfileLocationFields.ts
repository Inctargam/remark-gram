import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'

import { useCitiesQuery, useCountriesQuery } from '@/entities/location'
import type { ComboboxOption } from '@/shared/ui/combobox'

import type { EditProfileFormValues } from './editProfileFormValues'

type Params = {
  control: Control<EditProfileFormValues>
}

export const useProfileLocationFields = ({ control }: Params) => {
  const { field: countryField } = useController({ control, name: 'country' })
  const { field: regionField } = useController({ control, name: 'region' })
  const { field: cityField } = useController({ control, name: 'city' })
  const countriesQuery = useCountriesQuery()
  const countries = countriesQuery.data ?? []
  const selectedCountry = countries.find((country) => country.name === countryField.value)
  const selectedCountryCode = selectedCountry?.code ?? null
  const citiesQuery = useCitiesQuery(selectedCountryCode)
  const cities = citiesQuery.data ?? []
  const selectedCity = cities.find(
    (city) => city.name === cityField.value && city.region === regionField.value
  )

  const countryOptions: ComboboxOption[] = countries.map((country) => ({
    label: country.name,
    value: country.code,
  }))
  const cityOptions: ComboboxOption[] = cities.map((city) => ({
    label: city.name,
    value: city.id,
    description: city.region,
  }))

  const countryValueChangeHandler = (countryCode: string | null) => {
    if (countryCode === selectedCountryCode) {
      return
    }

    const country = countries.find((item) => item.code === countryCode)

    countryField.onChange(country?.name ?? '')
    regionField.onChange('')
    cityField.onChange('')
  }

  const cityValueChangeHandler = (cityId: string | null) => {
    if (cityId === selectedCity?.id) {
      return
    }

    const city = cities.find((item) => item.id === cityId)

    cityField.onChange(city?.name ?? '')
    regionField.onChange(city?.region ?? '')
  }

  const hasSelectedCountry = Boolean(selectedCountryCode)
  const countryError = countriesQuery.isError ? 'Failed to load countries' : undefined
  const cityError = citiesQuery.isError ? 'Failed to load cities' : undefined

  return {
    country: {
      disabled: countriesQuery.isError,
      error: countryError,
      onBlur: countryField.onBlur,
      onValueChange: countryValueChangeHandler,
      options: countryOptions,
      value: selectedCountry?.code ?? null,
    },
    city: {
      disabled: !hasSelectedCountry || countriesQuery.isError || citiesQuery.isError,
      emptyMessage: citiesQuery.isSuccess ? 'No Results' : null,
      error: cityError,
      limit: 50,
      onBlur: cityField.onBlur,
      onValueChange: cityValueChangeHandler,
      options: cityOptions,
      value: selectedCity?.id ?? null,
    },
  }
}
