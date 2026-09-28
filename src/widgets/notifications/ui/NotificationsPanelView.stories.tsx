import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import type { Notification } from '@/entities/notification'

import { NotificationsPanelView } from './NotificationsPanelView'

const notifications: Notification[] = [
  {
    id: 'notification-unread-1',
    kind: 'subscriptionActivated',
    message: 'Ваша подписка активирована и действует до 30.09.2026',
    createdAt: '2026-09-02T12:30:00.000Z',
    readAt: null,
    payload: { expiresAt: '2026-09-30T00:00:00.000Z' },
  },
  {
    id: 'notification-read-1',
    kind: 'nextPayment',
    message: 'Следующий платеж у вас спишется через 1 день',
    createdAt: '2026-09-01T08:05:00.000Z',
    readAt: '2026-09-01T08:30:00.000Z',
    payload: {},
  },
  {
    id: 'notification-unread-2',
    kind: 'subscriptionExpires',
    message:
      'Ваша подписка истекает через 7 дней. Проверьте способ оплаты, чтобы доступ не прерывался.',
    createdAt: '2026-08-31T19:15:00.000Z',
    readAt: null,
    payload: { daysLeft: 7 },
  },
]

const meta = {
  title: 'widgets/NotificationsPanelView',
  component: NotificationsPanelView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    notifications,
  },
} satisfies Meta<typeof NotificationsPanelView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Notifications')).toBeInTheDocument()
    await expect(
      canvas.getByText('Ваша подписка активирована и действует до 30.09.2026')
    ).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: {
    notifications: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No notifications yet')).toBeInTheDocument()
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    notifications: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Loading notifications')).toBeInTheDocument()
  },
}

export const Error: Story = {
  args: {
    error: 'Failed to load notifications',
    notifications: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failed to load notifications')).toBeInTheDocument()
  },
}

export const WithPagination: Story = {
  args: {
    hasNextPage: true,
    onLoadMore: fn(),
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show more' }))
    await expect((args as { onLoadMore?: () => void }).onLoadMore).toHaveBeenCalledOnce()
  },
}

export const FetchingNextPage: Story = {
  args: {
    hasNextPage: true,
    isFetchingNextPage: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Loading...' })).toBeDisabled()
  },
}
