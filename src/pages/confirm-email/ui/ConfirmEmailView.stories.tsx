import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'

import { ConfirmEmailView } from './ConfirmEmailView'

const meta = {
  title: 'pages/ConfirmEmailView',
  component: ConfirmEmailView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Презентационный компонент страницы подтверждения email. ' +
          'Три состояния: loading, success, expired. ' +
          'Данные передаются через пропсы — логика живёт в ConfirmEmailPage.',
      },
    },
  },
  args: {
    resendEmail: '',
    resendError: '',
    isResendPending: false,
    isResendSuccess: false,
    onResendEmailChange: fn(),
    onResend: fn(),
  },
} satisfies Meta<typeof ConfirmEmailView>

export default meta

type Story = StoryObj<typeof meta>

/** Страница загружается — ждём ответ от сервера. */
export const Loading: Story = {
  args: { status: 'loading' },
}

/** Email успешно подтверждён. Показывается кнопка Sign In. */
export const Success: Story = {
  args: { status: 'success' },
}

/** Ссылка истекла. Показывается форма для повторной отправки письма. */
export const Expired: Story = {
  args: { status: 'expired' },
}

/** Ссылка истекла + ошибка в поле email. */
export const ExpiredWithError: Story = {
  args: {
    status: 'expired',
    resendError: 'Email is required',
  },
}

/** Повторное письмо успешно отправлено. */
export const ResendSuccess: Story = {
  args: {
    status: 'expired',
    isResendSuccess: true,
  },
}
