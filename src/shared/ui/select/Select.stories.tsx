import type { Meta, StoryObj } from '@storybook/react'

import { Select } from './Select'

const options = [
  { label: 'Russia', value: 'russia' },
  { label: 'Ukraine', value: 'ukraine' },
  { label: 'Belarus', value: 'belarus' },
  { label: 'Kazakhstan', value: 'kazakhstan' },
]

const meta: Meta<typeof Select> = {
  title: 'Shared/UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    options,
    placeholder: 'Select country...',
  },
}

export const WithLabel: Story = {
  args: {
    options,
    label: 'Country',
    placeholder: 'Select country...',
  },
}

export const Disabled: Story = {
  args: {
    options,
    label: 'Country',
    placeholder: 'Select country...',
    disabled: true,
  },
}

export const WithSelectedValue: Story = {
  args: {
    options,
    label: 'Country',
    value: 'russia',
  },
}