import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { Recaptcha } from './Recaptcha'

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
      options: ['default', 'hover', 'checked', 'loading', 'error', 'expired'],
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
  args: {},
}

export const Hover: Story = {
  args: {
    state: 'hover',
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
    loadingDuration: 300,
    onVerify: fn(),
  },
  play: async ({ args, canvas }) => {
    const recaptcha = canvas.getByRole('checkbox', { name: "I'm not a robot" })

    await userEvent.click(recaptcha)
    await expect(args.onVerify).toHaveBeenCalled()
    await expect(recaptcha).toHaveAttribute('aria-checked', 'false')

    await waitFor(async () => {
      await expect(recaptcha).toHaveAttribute('aria-checked', 'true')
    })
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '20px 28px', gridTemplateColumns: 'repeat(2, 300px)' }}>
      <Recaptcha />
      <Recaptcha state="hover" />
      <Recaptcha state="checked" />
      <Recaptcha state="loading" />
      <Recaptcha state="error" />
      <Recaptcha state="expired" />
    </div>
  ),
}
