import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { type Profile, profileQueryKeys } from '@/entities/profile'
import type { SchemaMyProfileResponseDto } from '@/shared/api/openapi/schema'

import { EDIT_PROFILE_DRAFT_KEY, saveEditProfileDraft } from '../model/editProfileDraft'
import { EditProfileForm } from './EditProfileForm'

const INITIAL_PROFILE = {
  userId: 1,
  username: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: { code: 'US', name: { en: 'United States', ru: 'США' } },
  dateOfBirth: '1990-01-01',
  aboutMe: 'About me',
  avatarFileId: null,
}

let shouldFailUpdate = false
let shouldFailWithUsernameConflict = false
let shouldFailWithFieldValidation = false
let shouldFailCities = false
let profileDateOfBirth: string | null = INITIAL_PROFILE.dateOfBirth
let lastProfileUpdate: Record<string, unknown> | null = null
let delayedCitiesPath: string | null = null
let resolveCitiesRequest: (() => void) | null = null
let cityRequestCounts: Record<string, number> = {}

const LOCATION_FIXTURES: Record<string, unknown> = {
  '/locations/v1/cities/BY.json': [{ id: '1', name: 'Minsk', region: 'Minsk Region' }],
  '/locations/v1/cities/US.json': [
    { id: '2', name: 'Austin', region: 'Texas' },
    { id: '3', name: 'Austin', region: 'Minnesota' },
  ],
}

const getRequestUrl = (input: RequestInfo | URL) =>
  input instanceof Request ? input.url : String(input)

const stubProfileFetch = () => {
  const originalFetch = globalThis.fetch
  let profile: SchemaMyProfileResponseDto = { ...INITIAL_PROFILE }

  shouldFailUpdate = false
  shouldFailWithUsernameConflict = false
  shouldFailWithFieldValidation = false
  shouldFailCities = false
  profileDateOfBirth = INITIAL_PROFILE.dateOfBirth
  lastProfileUpdate = null
  delayedCitiesPath = null
  resolveCitiesRequest = null
  cityRequestCounts = {}

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const requestUrl = getRequestUrl(input)
    const requestMethod = input instanceof Request ? input.method : (init?.method ?? 'GET')
    const locationFixtureEntry = Object.entries(LOCATION_FIXTURES).find(([path]) =>
      requestUrl.endsWith(path)
    )

    if (locationFixtureEntry) {
      const [fixturePath, fixture] = locationFixtureEntry

      if (shouldFailCities && requestUrl.includes('/locations/v1/cities/')) {
        return Response.json({ message: 'Unavailable' }, { status: 500 })
      }

      if (fixturePath.includes('/locations/v1/cities/')) {
        cityRequestCounts[fixturePath] = (cityRequestCounts[fixturePath] ?? 0) + 1
      }

      if (fixturePath === delayedCitiesPath) {
        await new Promise<void>((resolve) => {
          resolveCitiesRequest = resolve
        })
      }

      return Response.json(fixture)
    }

    if (requestUrl.includes('/api/v1/countries')) {
      const term = new URL(requestUrl).searchParams.get('term')?.toLowerCase() ?? ''

      return Response.json(
        COUNTRIES.filter((country) => country.name.en.toLowerCase().includes(term))
      )
    }

    if (requestMethod !== 'PUT') {
      return Response.json({ ...profile, dateOfBirth: profileDateOfBirth })
    }

    if (shouldFailUpdate) {
      return Response.json({ message: 'Server unavailable.' }, { status: 500 })
    }

    if (shouldFailWithUsernameConflict) {
      return Response.json(
        { code: 'USERNAME_ALREADY_EXISTS', message: 'Username already exists' },
        { status: 409 }
      )
    }

    if (shouldFailWithFieldValidation) {
      return Response.json(
        { message: 'firstName was rejected by the user service' },
        { status: 400 }
      )
    }

    const requestBody = input instanceof Request ? await input.text() : String(init?.body)
    const update = JSON.parse(requestBody) as Record<string, string>
    lastProfileUpdate = update
    const country = COUNTRIES.find((item) => item.code === update.countryCode) ?? null
    profileDateOfBirth = update.dateOfBirth || null
    profile = {
      ...profile,
      username: update.username,
      firstName: update.firstName,
      lastName: update.lastName,
      dateOfBirth: profileDateOfBirth,
      aboutMe: update.aboutMe,
      country,
      city: update.city,
    }

    return new Response(null, { status: 204 })
  }) as typeof globalThis.fetch

  return () => {
    resolveCitiesRequest?.()
    shouldFailUpdate = false
    shouldFailWithUsernameConflict = false
    shouldFailWithFieldValidation = false
    shouldFailCities = false
    delayedCitiesPath = null
    resolveCitiesRequest = null
    cityRequestCounts = {}
    lastProfileUpdate = null
    window.sessionStorage.removeItem(EDIT_PROFILE_DRAFT_KEY)
    globalThis.fetch = originalFetch
  }
}

const createUnderageDate = () => {
  const today = new Date()

  return new Date(today.getFullYear() - 13, today.getMonth(), today.getDate() + 1)
}

const formatStoryDate = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const meta = {
  title: 'features/edit-profile/EditProfileForm',
  component: EditProfileForm,
  tags: ['autodocs'],
  args: {
    avatar: (
      <div
        aria-label="Profile photo"
        role="img"
        style={{ width: 192, height: 192, borderRadius: '50%', background: '#333' }}
      />
    ),
  },
  beforeEach: stubProfileFetch,
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 972,
          minHeight: '100vh',
          padding: 24,
          background: 'var(--color-dark-700)',
        }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/settings' } },
  },
} satisfies Meta<typeof EditProfileForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByLabelText('Username*')).toHaveValue('user123')
    await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  },
}

export const ValidationError: Story = {
  play: async ({ canvas }) => {
    const username = await canvas.findByLabelText('Username*')

    await userEvent.clear(username)
    await userEvent.type(username, 'short')
    await userEvent.tab()

    await expect(canvas.getByText('Minimum number of characters 6')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  },
}

export const CorrectedValidationError: Story = {
  play: async ({ canvas }) => {
    const username = await canvas.findByLabelText('Username*')
    const saveButton = canvas.getByRole('button', { name: 'Save Changes' })

    await userEvent.clear(username)
    await userEvent.type(username, 'short')
    await userEvent.tab()

    await expect(canvas.getByText('Minimum number of characters 6')).toBeVisible()
    await expect(saveButton).toBeDisabled()

    await userEvent.click(username)
    await userEvent.clear(username)
    await userEvent.type(username, 'valid-user')

    await waitFor(() => {
      expect(canvas.queryByText('Minimum number of characters 6')).not.toBeInTheDocument()
      expect(saveButton).toBeEnabled()
    })
  },
}

export const RequiredField: Story = {
  play: async ({ canvas }) => {
    const firstName = await canvas.findByLabelText('First Name*')

    await userEvent.clear(firstName)
    await userEvent.tab()

    await expect(canvas.getByText('This field is required.')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  },
}

export const CountryAndCitySelection: Story = {
  play: async ({ canvas, canvasElement }) => {
    const documentBody = canvasElement.ownerDocument.body
    const countryInput = await canvas.findByLabelText('Select your country')

    await expect(countryInput).toHaveValue('United States')
    await userEvent.click(countryInput)
    await userEvent.keyboard('{Control>}a{/Control}')
    await userEvent.keyboard('zzzzzz')
    await expect(await within(documentBody).findByText('No Results')).toBeVisible()
    await expect(within(documentBody).queryByRole('option')).not.toBeInTheDocument()
    await userEvent.tab()
    await expect(countryInput).toHaveValue('United States')

    await userEvent.click(countryInput)
    await userEvent.keyboard('{Control>}a{/Control}')
    await userEvent.keyboard('Bela')
    await within(documentBody).findByRole('option', { name: 'Belarus' })
    await expect(within(documentBody).getAllByRole('option')).toHaveLength(1)
    await userEvent.keyboard('{Enter}')
    await expect(countryInput).toHaveValue('Belarus')

    const cityInput = canvas.getByLabelText('Select your city')
    await waitFor(() => expect(cityInput).toBeEnabled())
    await userEvent.type(cityInput, 'Mi')
    await userEvent.click(await within(documentBody).findByRole('option', { name: /Minsk/ }))

    const saveButton = canvas.getByRole('button', { name: 'Save Changes' })
    await waitFor(() => expect(saveButton).toBeEnabled())
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(cityRequestCounts['/locations/v1/cities/BY.json']).toBe(1)
      expect(lastProfileUpdate).toMatchObject({
        city: 'Minsk',
        countryCode: 'BY',
      })
    })
  },
}

export const CitySearchWhileLoading: Story = {
  beforeEach: () => {
    delayedCitiesPath = '/locations/v1/cities/BY.json'
  },
  play: async ({ canvas, canvasElement }) => {
    const documentBody = canvasElement.ownerDocument.body
    const countryInput = await canvas.findByLabelText('Select your country')

    await userEvent.clear(countryInput)
    await userEvent.type(countryInput, 'Bela')
    await userEvent.click(await within(documentBody).findByRole('option', { name: 'Belarus' }))

    const cityInput = canvas.getByLabelText('Select your city')
    await expect(cityInput).toBeEnabled()
    await userEvent.type(cityInput, 'Mi')

    await expect(canvas.queryByText('No Results')).not.toBeInTheDocument()
    await waitFor(() => expect(resolveCitiesRequest).toBeTypeOf('function'))
    resolveCitiesRequest?.()

    await expect(await within(documentBody).findByRole('option', { name: /Minsk/ })).toBeVisible()
    await expect(cityInput).toHaveValue('Mi')
    await expect(cityRequestCounts['/locations/v1/cities/BY.json']).toBe(1)
  },
}

export const FailedCitiesLoad: Story = {
  beforeEach: () => {
    shouldFailCities = true
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Failed to load cities')).toBeVisible()
    await expect(canvas.getByLabelText('Select your city')).toBeDisabled()
  },
}

export const SuccessfulSave: Story = {
  play: async ({ canvas }) => {
    const firstName = await canvas.findByLabelText('First Name*')

    await userEvent.clear(firstName)
    await userEvent.type(firstName, 'Jane')
    await userEvent.tab()

    const saveButton = canvas.getByRole('button', { name: 'Save Changes' })
    await waitFor(() => expect(saveButton).toBeEnabled())
    await userEvent.click(saveButton)

    await expect(await canvas.findByRole('alert')).toHaveTextContent('Your settings are saved!')
    await expect(saveButton).toBeDisabled()
  },
}

export const FailedSave: Story = {
  beforeEach: () => {
    shouldFailUpdate = true
  },
  play: async ({ canvas }) => {
    const firstName = await canvas.findByLabelText('First Name*')

    await userEvent.clear(firstName)
    await userEvent.type(firstName, 'Jane')
    await userEvent.tab()

    const saveButton = canvas.getByRole('button', { name: 'Save Changes' })
    await waitFor(() => expect(saveButton).toBeEnabled())
    await userEvent.click(saveButton)

    await expect(await canvas.findByRole('alert')).toHaveTextContent('Error! Server unavailable.')
  },
}

export const PrivacyPolicyDraft: Story = {
  beforeEach: () => {
    profileDateOfBirth = formatStoryDate(createUnderageDate())
  },
  play: async ({ canvas }) => {
    const dateTrigger = await canvas.findByRole('button', { name: 'Date of birth' })

    await userEvent.click(dateTrigger)
    await userEvent.click(
      canvas.getByRole('button', { name: String(createUnderageDate().getDate()) })
    )

    const privacyPolicyLink = await canvas.findByRole('link', { name: 'Privacy Policy' })
    await expect(privacyPolicyLink).toHaveAttribute('href', '/privacy-policy')
    await userEvent.click(privacyPolicyLink)

    await expect(window.sessionStorage.getItem(EDIT_PROFILE_DRAFT_KEY)).toContain(
      '"username":"user123"'
    )
  },
}

export const RestoredPrivacyPolicyDraft: Story = {
  beforeEach: () => {
    const underageDate = createUnderageDate()

    saveEditProfileDraft({
      username: 'draft-user',
      firstName: 'Draft',
      lastName: 'User',
      dateOfBirth: underageDate,
      country: 'US',
      city: 'Austin',
      aboutMe: 'Restored after Privacy Policy',
    })
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByLabelText('Username*')).toHaveValue('draft-user')
    await expect(canvas.getByRole('button', { name: 'Date of birth' })).not.toHaveTextContent(
      'dd.mm.yyyy'
    )
    await expect(await canvas.findByRole('link', { name: 'Privacy Policy' })).toBeVisible()
    await expect(canvas.getByText('A user under 13 cannot create a profile.')).toBeVisible()
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Date of birth' })).toHaveStyle({
        borderColor: 'rgb(204, 20, 57)',
      })
    )
    await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
    await expect(window.sessionStorage.getItem(EDIT_PROFILE_DRAFT_KEY)).toBeNull()
  },
}

export const RestoredDraftWithCachedProfile: Story = {
  ...RestoredPrivacyPolicyDraft,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } })

      queryClient.setQueryData(profileQueryKeys.current(), {
        id: INITIAL_PROFILE.userId,
        userName: INITIAL_PROFILE.username,
        firstName: INITIAL_PROFILE.firstName,
        lastName: INITIAL_PROFILE.lastName,
        dateOfBirth: INITIAL_PROFILE.dateOfBirth,
        country: INITIAL_PROFILE.country.name.en,
        countryCode: INITIAL_PROFILE.country.code,
        city: INITIAL_PROFILE.city,
        aboutMe: INITIAL_PROFILE.aboutMe,
        avatarFileId: null,
      } satisfies Profile)

      return (
        <StrictMode>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </StrictMode>
      )
    },
  ],
}

const COUNTRIES = [
  { code: 'BY', name: { en: 'Belarus', ru: 'Беларусь' } },
  { code: 'US', name: { en: 'United States', ru: 'США' } },
]

export const UsernameAlreadyExists: Story = {
  beforeEach: () => {
    shouldFailWithUsernameConflict = true
  },
  play: async ({ canvas }) => {
    const username = await canvas.findByLabelText('Username*')

    await userEvent.clear(username)
    await userEvent.type(username, 'taken-user')
    await userEvent.tab()
    await userEvent.click(canvas.getByRole('button', { name: 'Save Changes' }))

    await expect(await canvas.findByText('Username already exists')).toBeVisible()
    await expect(username).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const BackendFieldValidation: Story = {
  beforeEach: () => {
    shouldFailWithFieldValidation = true
  },
  play: async ({ canvas }) => {
    const firstName = await canvas.findByLabelText('First Name*')

    await userEvent.clear(firstName)
    await userEvent.type(firstName, 'Jane')
    await userEvent.tab()
    await userEvent.click(canvas.getByRole('button', { name: 'Save Changes' }))

    await expect(
      await canvas.findByText('firstName was rejected by the user service')
    ).toBeVisible()
    await expect(firstName).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
  },
}

export const DuplicateCityNames: Story = {
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByLabelText('Select your city')
    await userEvent.click(canvas.getByRole('button', { name: 'Show Select your city options' }))

    const cityOptions = await within(canvasElement.ownerDocument.body).findAllByRole('option', {
      name: 'Austin',
    })

    await expect(cityOptions).toHaveLength(1)
  },
}
