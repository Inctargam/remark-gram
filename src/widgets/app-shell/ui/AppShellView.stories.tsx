import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { AppShellView } from './AppShellView'

const meta = {
  component: AppShellView,
  args: {
    children: <main>Page content</main>,
    onLogout: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShellView>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    status: 'loading',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Page content')).toBeVisible()
    await expect(canvas.queryByRole('banner')).not.toBeInTheDocument()
  },
}

export const Guest: Story = {
  args: {
    status: 'guest',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log in' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Log Out' })).not.toBeInTheDocument()
  },
}

export const GuestOnAuthRoute: Story = {
  args: {
    showGuestAuthActions: false,
    status: 'guest',
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Log in')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Sign up')).not.toBeInTheDocument()
  },
}

export const Authenticated: Story = {
  args: {
    status: 'authenticated',
  },
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))
    const documentCanvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(documentCanvas.getByRole('button', { name: 'Yes' }))
    await expect(args.onLogout).toHaveBeenCalledOnce()
  },
}

/** Guards the desktop shell: the header scrolls away while the sidebar remains available. */
export const AuthenticatedLongContent: Story = {
  args: {
    status: 'authenticated',
    children: <main style={{ height: '4000px' }}>Long page content</main>,
  },
  play: async ({ canvas, canvasElement }) => {
    const { defaultView: view, documentElement } = canvasElement.ownerDocument
    const header = canvas.getByRole('banner')
    const sidebar = canvas.getByRole('navigation', { name: 'Primary navigation' })
    const logout = canvas.getByRole('button', { name: 'Log Out' })
    const desktopContent = sidebar.parentElement?.parentElement

    canvasElement.style.width = '1440px'

    await expect(desktopContent).toBeDefined()
    await expect(desktopContent?.getBoundingClientRect().width).toBe(1280)
    await expect(desktopContent?.getBoundingClientRect().left).toBe(80)

    canvasElement.style.removeProperty('width')

    view?.scrollTo(0, 1500)
    await waitFor(() => expect(view?.scrollY).toBeGreaterThan(0))

    await expect(header.getBoundingClientRect().bottom).toBeLessThanOrEqual(0)
    await expect(Math.abs(sidebar.getBoundingClientRect().top)).toBeLessThanOrEqual(1)
    const logoutBottom = logout.getBoundingClientRect().bottom

    await expect(logoutBottom).toBeLessThanOrEqual(documentElement.clientHeight)
    await expect(logoutBottom).toBeGreaterThan(0)
    // No horizontal overflow on the document
    await expect(documentElement.scrollWidth).toBeLessThanOrEqual(documentElement.clientWidth)

    view?.scrollTo(0, 0)
  },
}
