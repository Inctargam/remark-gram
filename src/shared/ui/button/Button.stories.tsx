import type { Meta, StoryObj } from 'storybook/react'

import { Button } from './Button'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'text'],
      description: 'Визуальный вариант кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает кнопку',
    },
    children: {
      control: 'text',
      description: 'Текст или содержимое кнопки',
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Primary Button', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Secondary Button', variant: 'secondary' },
}

export const Outline: Story = {
  args: { children: 'Outline Button', variant: 'outline' },
}

export const Text: Story = {
  args: { children: 'Text Button', variant: 'text' },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
}
