import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

import type { Post, PostsPage } from '@/entities/post'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'
import { AppShellView } from '@/widgets/app-shell'

import { ProfilePage } from './ProfilePage'

const OTHER_USER_ID = 'mock-user-2'

const createImageUrl = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="hsl(${hue}, 42%, 32%)"/><text x="50%" y="52%" fill="hsl(${hue}, 60%, 88%)" font-family="sans-serif" font-size="220" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`

const createPage = (ownerId: string): PostsPage => ({
  items: Array.from(
    { length: 8 },
    (_, index): Post => ({
      id: `${ownerId}-post-${index + 1}`,
      ownerId,
      ownerUsername: 'UserName',
      ownerAvatarUrl: null,
      images: [
        { url: createImageUrl(`${index + 1}`, (index * 37) % 360), width: 1080, height: 1080 },
      ],
      description: `Mock publication ${index + 1}`,
      createdAt: '2026-07-01T12:00:00.000Z',
      updatedAt: '2026-07-01T12:00:00.000Z',
    })
  ),
  nextCursor: null,
})

/**
 * Storybook does not run Next.js route handlers, so the posts mock endpoint is stubbed here.
 * The stub keeps deleted ids so that a refetched feed really comes back without them, and is
 * restored after every story.
 */
const stubPostsFetch = () => {
  const originalFetch = globalThis.fetch
  const deletedIds = new Set<string>()

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const method = init?.method ?? 'GET'

    if (method === 'DELETE') {
      deletedIds.add(url.split('/').pop() ?? '')

      return new Response(null, { status: 204 })
    }

    const ownerId = url.includes(OTHER_USER_ID) ? OTHER_USER_ID : MOCK_CURRENT_USER_ID
    const page = createPage(ownerId)

    return Response.json({
      ...page,
      items: page.items.filter(({ id }) => !deletedIds.has(id)),
    })
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const meta = {
  title: 'pages/ProfilePage',
  component: ProfilePage,
  tags: ['autodocs'],
  args: {
    userId: MOCK_CURRENT_USER_ID,
  },
  beforeEach: stubPostsFetch,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: `/profile/${MOCK_CURRENT_USER_ID}`,
      },
    },
  },
} satisfies Meta<typeof ProfilePage>

export default meta

type Story = StoryObj<typeof meta>

export const OwnProfile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByAltText('Mock publication 1')).toBeInTheDocument()
    await expect(canvas.getAllByRole('img')).toHaveLength(8)
    await expect(canvas.getByRole('button', { name: 'Profile Settings' })).toBeInTheDocument()
  },
}

export const DesktopLayout: Story = {
  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false,
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <ProfilePage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByAltText('Mock publication 1')).toBeInTheDocument()

    const profile = canvas.getByRole('region', { name: 'UserName' })
    const header = canvas.getByRole('banner')
    const sidebar = canvas.getByRole('navigation', { name: 'Primary navigation' })
    const languageSwitcher = canvas.getByRole('combobox')
    const settingsButton = canvas.getByRole('button', { name: 'Profile Settings' })
    const fourthPost = canvas.getByAltText('Mock publication 4').closest('button')
    const view = canvasElement.ownerDocument.defaultView
    const languageBounds = languageSwitcher.getBoundingClientRect()
    const settingsBounds = settingsButton.getBoundingClientRect()

    await expect(view?.getComputedStyle(profile).overflowY).toBe('visible')
    await expect(header.getBoundingClientRect().height).toBe(60)
    await expect(profile.getBoundingClientRect().top).toBe(60)
    await expect(sidebar.getBoundingClientRect().top).toBe(60)
    await expect({
      x: languageBounds.x,
      y: languageBounds.y,
      width: languageBounds.width,
      height: languageBounds.height,
    }).toEqual({ x: 1053, y: 12, width: 163, height: 36 })
    await expect({
      x: settingsBounds.x,
      y: settingsBounds.y,
      width: settingsBounds.width,
      height: settingsBounds.height,
    }).toEqual({ x: 1049, y: 96, width: 167, height: 36 })
    await expect(fourthPost).not.toBeNull()

    for (const responsiveWidth of [1270, 1240, 1100]) {
      canvasElement.style.width = `${responsiveWidth}px`

      const languageRight = languageSwitcher.getBoundingClientRect().right
      const settingsRight = settingsButton.getBoundingClientRect().right
      const postsRight = fourthPost?.getBoundingClientRect().right ?? 0

      await expect(Math.abs(languageRight - settingsRight)).toBeLessThanOrEqual(1)
      await expect(Math.abs(languageRight - postsRight)).toBeLessThanOrEqual(1)
    }

    canvasElement.style.removeProperty('width')

    // Storybook's desktop viewport is taller than the Figma frame, so extend only this
    // interaction check to exercise document scrolling with the desktop app chrome.
    profile.style.minHeight = `${(view?.innerHeight ?? 720) + 200}px`
    view?.scrollTo(0, 200)
    await waitFor(() => expect(view?.scrollY).toBeGreaterThan(0))

    await expect(header.getBoundingClientRect().bottom).toBeLessThanOrEqual(0)
    await expect(Math.abs(sidebar.getBoundingClientRect().top)).toBeLessThanOrEqual(1)

    view?.scrollTo(0, 0)
    profile.style.removeProperty('min-height')
  },
}

export const WideDesktopLayout: Story = {
  globals: {
    viewport: {
      value: 'wideDesktop',
      isRotated: false,
    },
  },
  parameters: {
    viewport: {
      options: {
        wideDesktop: {
          name: 'Wide desktop',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <ProfilePage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas }) => {
    const fourthPost = (await canvas.findByAltText('Mock publication 4')).closest('button')
    const sidebarLeft = canvas
      .getByRole('navigation', { name: 'Primary navigation' })
      .getBoundingClientRect().left
    const logoLeft = canvas.getByRole('link', { name: 'Remarkgram' }).getBoundingClientRect().left
    const languageRight = canvas.getByRole('combobox').getBoundingClientRect().right
    const settingsRight = canvas
      .getByRole('button', { name: 'Profile Settings' })
      .getBoundingClientRect().right
    const postsRight = fourthPost?.getBoundingClientRect().right ?? 0

    await expect(sidebarLeft).toBe(0)
    await expect(logoLeft).toBe(60)
    await expect(languageRight).toBe(1556)
    await expect(settingsRight).toBe(1556)
    await expect(postsRight).toBe(1556)
  },
}

export const TabletLayout: Story = {
  globals: {
    viewport: {
      value: 'tablet',
      isRotated: false,
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <ProfilePage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas }) => {
    const thirdPost = (await canvas.findByAltText('Mock publication 3')).closest('button')
    const languageRight = canvas.getByRole('combobox').getBoundingClientRect().right
    const settingsRight = canvas
      .getByRole('button', { name: 'Profile Settings' })
      .getBoundingClientRect().right
    const postsRight = thirdPost?.getBoundingClientRect().right ?? 0

    await expect(canvas.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await expect(Math.abs(languageRight - settingsRight)).toBeLessThanOrEqual(1)
    await expect(Math.abs(languageRight - postsRight)).toBeLessThanOrEqual(1)
  },
}

export const MobileLayout: Story = {
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false,
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <ProfilePage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas }) => {
    const images = await canvas.findAllByRole('img')
    const tiles = images.map((image) => image.closest('button')?.getBoundingClientRect())
    const [firstTile, secondTile, thirdTile, fourthTile] = tiles

    await expect(canvas.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Profile Settings' })).not.toBeInTheDocument()
    await expect(firstTile).toBeDefined()
    await expect(Math.round(firstTile?.width ?? 0)).toBe(Math.round(firstTile?.height ?? 1))
    await expect(Math.round(secondTile?.top ?? -1)).toBe(Math.round(firstTile?.top ?? 0))
    await expect(Math.round(thirdTile?.top ?? -1)).toBe(Math.round(firstTile?.top ?? 0))
    await expect(fourthTile?.top ?? 0).toBeGreaterThan(firstTile?.bottom ?? 0)
  },
}

/** Opening a post keeps the URL: the view is a modal over the profile, not a route. */
export const OpenPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByAltText('Mock publication 2'))

    // The modal renders in a portal, so it is looked up in the whole document.
    const dialog = await screen.findByRole('dialog')

    await expect(within(dialog).getByText('Mock publication 2')).toBeVisible()
    await expect(within(dialog).getByText('July 1, 2026')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

/** UC-2 entry point: the owner reaches the edit form through the three-dot menu on the post. */
export const EditOwnPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByAltText('Mock publication 1'))
    await userEvent.click(await screen.findByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Edit Post' }))

    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toHaveTextContent('Edit Post')
    await expect(screen.getByLabelText('Add publication descriptions')).toHaveValue(
      'Mock publication 1'
    )
  },
}

/** UC-3 end to end: menu → confirmation → post gone from the feed, user stays on the profile. */
export const DeleteOwnPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByAltText('Mock publication 3'))
    await userEvent.click(await screen.findByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete Post' }))

    await expect(
      await screen.findByText('Are you sure you want to delete this post?')
    ).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    // Both the confirmation and the post view close; the profile grid is what stays.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(canvas.queryByAltText('Mock publication 3')).not.toBeInTheDocument())
    await expect(canvas.getByAltText('Mock publication 1')).toBeInTheDocument()
  },
}

export const OtherUserProfile: Story = {
  args: {
    userId: OTHER_USER_ID,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByAltText('Mock publication 1')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Profile Settings' })).not.toBeInTheDocument()
  },
}
