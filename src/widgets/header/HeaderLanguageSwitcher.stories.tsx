import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'

import { HeaderLanguageSwitcher } from './HeaderLanguageSwitcher'

const meta = {
  title: 'widgets/HeaderLanguageSwitcher',
  component: HeaderLanguageSwitcher,
  tags: ['autodocs'],
  args: {
    value: 'en',
    onValueChange: fn(),
  },
} satisfies Meta<typeof HeaderLanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  args: {
    compact: true,
  },
}

export const SelectsRussian: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Language: English' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Russian' }))

    await expect(args.onValueChange).toHaveBeenCalledWith('ru')
  },
}
