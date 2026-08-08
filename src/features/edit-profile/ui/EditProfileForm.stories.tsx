import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { EDIT_PROFILE_DRAFT_KEY, saveEditProfileDraft } from '../model/editProfileDraft'
import { EditProfileForm } from './EditProfileForm'

const INITIAL_PROFILE = {
  id: 1,
  userName: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: 'United States',
  region: 'Texas',
  dateOfBirth: '1990-01-01',
  aboutMe: 'About me',
  avatars: [],
  createdAt: '2026-08-06T14:41:15.904Z',
}

let shouldFailUpdate = false
let shouldFailCities = false
let profileDateOfBirth = INITIAL_PROFILE.dateOfBirth
let lastProfileUpdate: Record<string, unknown> | null = null
let delayedCitiesPath: string | null = null
let resolveCitiesRequest: (() => void) | null = null
let cityRequestCounts: Record<string, number> = {}

const LOCATION_FIXTURES: Record<string, unknown> = {
  '/locations/v1/countries.json': [
    { code: 'BY', name: 'Belarus' },
    { code: 'US', name: 'United States' },
  ],
  '/locations/v1/cities/BY.json': [{ id: '1', name: 'Minsk', region: 'Minsk Region' }],
  '/locations/v1/cities/US.json': [{ id: '2', name: 'Austin', region: 'Texas' }],
}

const getRequestUrl = (input: RequestInfo | URL) =>
  input instanceof Request ? input.url : String(input)

const stubProfileFetch = () => {
  const originalFetch = globalThis.fetch
  let profile = { ...INITIAL_PROFILE }

  shouldFailUpdate = false
  shouldFailCities = false
  profileDateOfBirth = INITIAL_PROFILE.dateOfBirth
  lastProfileUpdate = null
  delayedCitiesPath = null
  resolveCitiesRequest = null
  cityRequestCounts = {}

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const requestUrl = getRequestUrl(input)
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

    if (init?.method !== 'PUT') {
      return Response.json({ ...profile, dateOfBirth: profileDateOfBirth })
    }

    if (shouldFailUpdate) {
      return Response.json({ message: 'Server unavailable.' }, { status: 500 })
    }

    const update = JSON.parse(String(init.body)) as Record<string, unknown>
    lastProfileUpdate = update
    profile = { ...profile, ...update }

    return Response.json(profile)
  }) as typeof globalThis.fetch

  return () => {
    resolveCitiesRequest?.()
    shouldFailUpdate = false
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

    await userEvent.clear(countryInput)
    await userEvent.type(countryInput, 'Bela')
    await userEvent.click(await within(documentBody).findByRole('option', { name: 'Belarus' }))

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
        country: 'Belarus',
        region: 'Minsk Region',
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
      country: 'United States',
      region: 'Texas',
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
    await expect(window.sessionStorage.getItem(EDIT_PROFILE_DRAFT_KEY)).toBeNull()
  },
}
