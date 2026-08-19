import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import { MockPaypalPage } from './MockPaypalPage'

type CapturedRequest = {
  method: string
  url: string
  body: unknown
}

const capturedRequests: CapturedRequest[] = []

/**
 * Storybook does not run Next.js route handlers, so the subscriptions mock endpoint is
 * stubbed here. The response never settles: the page must stay locked while the capture
 * is in flight, and a settled response would trigger a real navigation in the iframe.
 */
const stubCompleteFetch = () => {
  const originalFetch = globalThis.fetch

  capturedRequests.length = 0

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null

    capturedRequests.push({ method: init?.method ?? 'GET', url, body })

    return new Promise<Response>(() => {})
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const SESSION_ID = 'mock-paypal-session-01'
const RETURN_URL = '/settings?part=subscriptions'

const meta = {
  title: 'pages/MockPaypalPage',
  component: MockPaypalPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/payments/mock-paypal',
        query: { sessionId: SESSION_ID, returnUrl: RETURN_URL },
      },
    },
    docs: {
      story: {
        iframeHeight: 420,
        inline: false,
      },
    },
  },
  beforeEach: () => stubCompleteFetch(),
} satisfies Meta<typeof MockPaypalPage>

export default meta

type Story = StoryObj<typeof meta>

/** Approval-страница с валидной сессией: кнопки Approve и Cancel. */
export const Default: Story = {
  play: async () => {
    await screen.findByText('PayPal')

    await expect(screen.getByRole('button', { name: 'Approve' })).toBeEnabled()
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
    await expect(screen.getByText(`Session: ${SESSION_ID}`)).toBeInTheDocument()
  },
}

/** Approve отправляет outcome success на capture и блокирует кнопки до ухода. */
export const Approve: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }))

    await waitFor(() => expect(capturedRequests).toHaveLength(1))
    await expect(capturedRequests[0].method).toBe('POST')
    await expect(capturedRequests[0].url).toContain(`/checkout/${SESSION_ID}/complete`)
    await expect(capturedRequests[0].body).toEqual({ outcome: 'success' })
    await expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

/** Cancel отправляет outcome failed и блокирует кнопки до ухода. */
export const Cancel: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(capturedRequests).toHaveLength(1))
    await expect(capturedRequests[0].body).toEqual({ outcome: 'failed' })
    await expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  },
}

/** Без sessionId страница показывает fallback со ссылкой на настройки. */
export const NoSession: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { sessionId: '' },
      },
    },
  },
  play: async () => {
    await screen.findByText('This page opens only from a checkout session.')

    await expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument()
    await expect(screen.getByRole('link', { name: 'Back to settings' })).toHaveAttribute(
      'href',
      '/settings?part=subscriptions'
    )
  },
}
