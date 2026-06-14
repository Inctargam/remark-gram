import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { Recaptcha, type RecaptchaState } from './Recaptcha'

const meta = {
  title: 'shared/ui/Recaptcha',
  component: Recaptcha,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'checked', 'loading', 'error', 'expired'],
      description: 'Визуальное состояние reCAPTCHA',
    },
    label: {
      control: 'text',
      description: 'Текст проверки',
    },
  },
} satisfies Meta<typeof Recaptcha>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    state: 'default',
  },
}

export const Checked: Story = {
  args: {
    state: 'checked',
  },
}

export const Loading: Story = {
  args: {
    state: 'loading',
  },
}

export const Error: Story = {
  args: {
    state: 'error',
  },
}

export const Expired: Story = {
  args: {
    state: 'expired',
  },
}

export const Interactive: Story = {
  args: {
    onVerifyRequest: fn(),
    state: 'default',
  },
  render: ({ onVerifyRequest, state }) => {
    const [recaptchaState, setRecaptchaState] = useState<RecaptchaState>(state)

    const verifyRequestHandler = () => {
      onVerifyRequest?.()
      setRecaptchaState('loading')

      setTimeout(() => {
        setRecaptchaState('checked')
      }, 300)
    }

    return <Recaptcha state={recaptchaState} onVerifyRequest={verifyRequestHandler} />
  },
  play: async ({ args, canvas }) => {
    const recaptcha = canvas.getByRole('checkbox', { name: "I'm not a robot" })

    await userEvent.click(recaptcha)
    await expect(args.onVerifyRequest).toHaveBeenCalled()
    await expect(recaptcha).toHaveAttribute('aria-checked', 'false')

    await waitFor(async () => {
      await expect(recaptcha).toHaveAttribute('aria-checked', 'true')
    })
  },
}

export const AllStates: Story = {
  args: {
    state: 'default',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '20px 28px', gridTemplateColumns: 'repeat(2, 300px)' }}>
      <Recaptcha state="default" />
      <Recaptcha state="checked" />
      <Recaptcha state="loading" />
      <Recaptcha state="error" />
      <Recaptcha state="expired" />
    </div>
  ),
}
