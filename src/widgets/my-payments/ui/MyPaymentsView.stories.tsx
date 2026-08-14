import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import type { Payment } from '@/entities/payment'

import { MyPaymentsView } from './MyPaymentsView'

const PAYMENTS: Payment[] = [
  {
    id: 'payment-1',
    dateOfPayment: '2022-12-12T00:00:00.000Z',
    endDateOfSubscription: '2022-12-13T00:00:00.000Z',
    priceCents: 1000,
    subscriptionType: 'day',
    paymentType: 'stripe',
  },
  {
    id: 'payment-2',
    dateOfPayment: '2022-12-12T00:00:00.000Z',
    endDateOfSubscription: '2022-12-19T00:00:00.000Z',
    priceCents: 5000,
    subscriptionType: 'week',
    paymentType: 'paypal',
  },
  {
    id: 'payment-3',
    dateOfPayment: '2022-12-12T00:00:00.000Z',
    endDateOfSubscription: '2023-01-11T00:00:00.000Z',
    priceCents: 10000,
    subscriptionType: 'month',
    paymentType: 'paypal',
  },
]

const meta = {
  title: 'widgets/MyPaymentsView',
  component: MyPaymentsView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    errorMessage: null,
    isLoading: false,
    page: 1,
    pageSize: 10,
    payments: PAYMENTS,
    totalPages: 1,
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
} satisfies Meta<typeof MyPaymentsView>

export default meta

type Story = StoryObj<typeof meta>

/** Одна страница платежей: подписи периодов и провайдеров — как на макете. */
export const SinglePage: Story = {
  play: async ({ canvas }) => {
    expect(canvas.getAllByRole('row')).toHaveLength(PAYMENTS.length + 1)
    expect(canvas.getByText('7 days')).toBeInTheDocument()
    expect(canvas.getAllByText('PayPal')).toHaveLength(2)
    expect(canvas.getByText('$100')).toBeInTheDocument()
  },
}

/** Несколько страниц: клик по номеру уходит наверх, состояние страницы держит виджет. */
export const ManyPages: Story = {
  args: {
    page: 2,
    totalPages: 12,
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: '3' }))

    expect(args.onPageChange).toHaveBeenCalledWith(3)
  },
}

/** Платежей нет: строка-заглушка на всю ширину таблицы. */
export const Empty: Story = {
  args: {
    payments: [],
    totalPages: 0,
  },
  play: async ({ canvas }) => {
    expect(canvas.getByText('You have no payments yet.')).toBeInTheDocument()
    // Пагинация без страниц не рендерится — прятать её отдельно не нужно.
    expect(canvas.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  },
}

/** Первая загрузка: скелетон вместо строк, шапка уже на месте. */
export const Loading: Story = {
  args: {
    isLoading: true,
    payments: [],
    totalPages: 0,
  },
  play: async ({ canvas }) => {
    expect(canvas.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(canvas.queryByText('You have no payments yet.')).not.toBeInTheDocument()
  },
}

export const LoadError: Story = {
  args: {
    errorMessage: 'Failed to load payments. Please try again.',
  },
}
