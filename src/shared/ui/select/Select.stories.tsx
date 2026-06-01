import type { Meta, StoryObj } from '@storybook/react'

import { Select } from './Select'

const options = [
  { label: 'Select-box', value: 'option-1' },
  { label: 'Select-box', value: 'option-2' },
  { label: 'Select-box', value: 'option-3' },
]

const meta: Meta<typeof Select> = {
  title: 'Shared/UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#171717' }],
    },
  },
  args: {
    options,
    placeholder: 'Select-box',
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const Active: Story = {
  args: {
    value: 'option-1',
  },
}

export const Hover: Story = {
  parameters: {
    pseudo: { hover: true },
  },
}

export const Focus: Story = {
  parameters: {
    pseudo: { focusVisible: true },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}