import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Card } from './Card'

const meta = {
  title: 'shared/ui/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Внутренний отступ карточки',
    },
    children: {
      control: 'text',
      description: 'Содержимое карточки',
    },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Card content',
  },
  render: (args) => (
    <div style={{ width: '378px' }}>
      <Card {...args} />
    </div>
  ),
}

export const Compact: Story = {
  args: {
    children: 'Compact card',
    padding: 'small',
  },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Card {...args} />
    </div>
  ),
}

export const FlexibleSize: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px', width: '520px' }}>
      <Card padding="small">Small padding, parent controls width</Card>
      <Card>Medium padding, parent controls width</Card>
      <Card padding="large">Large padding, parent controls width</Card>
    </div>
  ),
}
