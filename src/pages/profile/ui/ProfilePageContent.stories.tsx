import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, fn, userEvent } from 'storybook/test'

import { postsQueryKeys } from '@/entities/post'
import { type Profile, profileQueryKeys, updateCurrentProfileCaches } from '@/entities/profile'
import { refreshSession, sessionStore } from '@/shared/auth'

import { ProfilePageContent } from './ProfilePageContent'

const PROFILE: Profile = {
  id: 42,
  userName: 'ownUser',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  country: '',
  countryCode: null,
  city: '',
  aboutMe: 'Own biography',
  avatarFileId: 'own-avatar',
}
const profileRequest = fn()
const currentUserRequest = fn()
let queryClient: QueryClient
let shouldFail = false
let currentUserFailure: 'server' | 'network' | null = null

const setOwnerSession = () =>
  sessionStore.getState().setAuthenticated('token', {
    id: '42',
    username: 'oldName',
    email: 'user@example.com',
    avatarUrl: null,
  })

const setLoadingSession = () =>
  sessionStore.setState({
    status: 'loading',
    currentUser: null,
    accessToken: null,
    currentUserLoadFailureAt: null,
  })

const meta = {
  title: 'pages/profile/ProfilePageContent',
  component: ProfilePageContent,
  tags: ['autodocs'],
  args: { initialProfile: null, initialSelectedPost: null, userId: '42' },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  beforeEach: () => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    for (const userId of ['42', '99']) {
      queryClient.setQueryData(postsQueryKeys.list(userId), {
        pages: [{ items: [], nextCursor: null }],
        pageParams: [null],
      })
    }
    shouldFail = false
    currentUserFailure = null
    profileRequest.mockClear()
    currentUserRequest.mockClear()
    setOwnerSession()
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (input, init) => {
      const request = input instanceof Request ? input : new Request(input, init)
      const path = new URL(request.url).pathname
      if (path.endsWith('/auth/refresh-token')) {
        return Response.json({ accessToken: 'token' })
      }
      if (path.endsWith('/auth/me')) {
        currentUserRequest()
        if (currentUserFailure === 'network') {
          throw new TypeError('Failed to fetch')
        }
        if (currentUserFailure === 'server') {
          return Response.json({ message: 'Unavailable' }, { status: 500 })
        }
        return Response.json({
          id: 42,
          username: 'ownUser',
          email: 'user@example.com',
          avatarUrl: null,
        })
      }
      if (path.endsWith('/profile')) {
        profileRequest(path)
        if (shouldFail) {
          return Response.json({ message: 'Unavailable' }, { status: 500 })
        }
        const isOwnProfile = path.endsWith('/me/profile')
        return Response.json({
          userId: isOwnProfile ? 42 : 99,
          username: isOwnProfile ? 'ownUser' : 'otherUser',
          aboutMe: isOwnProfile ? 'Own biography' : 'Other biography',
          avatarFileId: isOwnProfile ? 'own-avatar' : 'other-avatar',
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          country: null,
          city: null,
        })
      }
      if (path.includes('/files/images/')) {
        return new Response(
          '<svg xmlns="http://www.w3.org/2000/svg" width="204" height="204"><rect width="204" height="204" fill="#4779af"/></svg>',
          { headers: { 'Content-Type': 'image/svg+xml' } }
        )
      }
      return Response.json({ items: [], nextCursor: null })
    }
    return () => {
      globalThis.fetch = originalFetch
      queryClient.clear()
      sessionStore.getState().setGuest()
    }
  },
} satisfies Meta<typeof ProfilePageContent>

export default meta
type Story = StoryObj<typeof meta>

export const OwnProfile: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'ownUser' })).toBeVisible()
    await expect(canvas.getByText('Own biography')).toBeVisible()
    const avatar = canvas.getByAltText('ownUser avatar')
    await expect(avatar).toHaveAttribute('src', expect.stringContaining('/files/images/own-avatar'))
    await expect(profileRequest.mock.calls).toEqual([['/api/v1/users/me/profile']])
  },
}

export const OtherProfile: Story = {
  args: { userId: '99' },
  beforeEach: () => {
    queryClient.setQueryData(profileQueryKeys.current(), PROFILE)
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'otherUser' })).toBeVisible()
    await expect(canvas.getByAltText('otherUser avatar')).toHaveAttribute(
      'src',
      expect.stringContaining('/files/images/other-avatar')
    )
    await expect(canvas.queryByRole('button', { name: 'Profile Settings' })).not.toBeInTheDocument()
    await expect(profileRequest.mock.calls).toEqual([['/api/v1/users/99/profile']])
  },
}

export const GuestProfile: Story = {
  args: { userId: '99' },
  beforeEach: () => sessionStore.getState().setGuest(),
  play: OtherProfile.play,
}

export const CachedOwnProfile: Story = {
  beforeEach: () => {
    queryClient.setQueryData(profileQueryKeys.current(), PROFILE)
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'ownUser' })).toBeVisible()
    await expect(profileRequest).not.toHaveBeenCalled()
    updateCurrentProfileCaches(queryClient, {
      ...PROFILE,
      userName: 'updatedUser',
      avatarFileId: null,
    })
    await expect(await canvas.findByRole('heading', { name: 'updatedUser' })).toBeVisible()
    await expect(canvas.queryByAltText('ownUser avatar')).not.toBeInTheDocument()
    await expect(profileRequest).not.toHaveBeenCalled()
  },
}

export const SessionLoading: Story = {
  beforeEach: setLoadingSession,
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('status')).toHaveTextContent('Loading profile')
    await expect(profileRequest).not.toHaveBeenCalled()
    // Refresh sets the token before /me returns the current identity.
    sessionStore.getState().setAuthenticated('token')
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading profile')
    await expect(profileRequest).not.toHaveBeenCalled()
    setOwnerSession()
    await expect(await canvas.findByRole('heading', { name: 'ownUser' })).toBeVisible()
    await expect(profileRequest.mock.calls).toEqual([['/api/v1/users/me/profile']])
  },
}

export const SessionServerError: Story = {
  beforeEach: () => {
    setLoadingSession()
    currentUserFailure = 'server'
  },
  play: async ({ canvas }) => {
    await refreshSession()
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Failed to load profile.')
    await expect(profileRequest).not.toHaveBeenCalled()
    await expect(sessionStore.getState().accessToken).toBe('token')

    currentUserFailure = null
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))

    await expect(await canvas.findByRole('heading', { name: 'ownUser' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Profile Settings' })).toBeVisible()
    await expect(currentUserRequest).toHaveBeenCalledTimes(2)
    await expect(profileRequest.mock.calls).toEqual([['/api/v1/users/me/profile']])
  },
}

export const SessionNetworkError: Story = {
  beforeEach: () => {
    setLoadingSession()
    currentUserFailure = 'network'
  },
  play: SessionServerError.play,
}

export const FailedSessionRetry: Story = {
  beforeEach: SessionServerError.beforeEach,
  play: async ({ canvas }) => {
    await refreshSession()
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Failed to load profile.')

    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))

    await expect(await canvas.findByRole('alert')).toHaveTextContent('Failed to load profile.')
    await expect(currentUserRequest).toHaveBeenCalledTimes(2)
    await expect(profileRequest).not.toHaveBeenCalled()
    await expect(sessionStore.getState().accessToken).toBe('token')
  },
}

export const FailedLoad: Story = {
  beforeEach: () => {
    shouldFail = true
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Failed to load profile.')
    shouldFail = false
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(await canvas.findByRole('heading', { name: 'ownUser' })).toBeVisible()
    await expect(profileRequest).toHaveBeenCalledTimes(2)
  },
}
