import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { Checkbox } from './Checkbox'

const meta = {
  title: 'shared/ui/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Подпись чекбокса',
    },
    checked: {
      control: 'boolean',
      description: 'Контролируемое выбранное состояние',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Начальное выбранное состояние',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает чекбокс',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  args: {
    children: 'Check-box',
  },
}

export const Checked: Story = {
  args: {
    children: 'Check-box',
    defaultChecked: true,
  },
}

export const DisabledUnchecked: Story = {
  args: {
    children: 'Check-box',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    children: 'Check-box',
    defaultChecked: true,
    disabled: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Accept terms',
  },
}

export const Interactive: Story = {
  args: {
    children: 'Check-box',
    onCheckedChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Check-box' })

    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenCalled()
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <Checkbox>Check-box</Checkbox>
      <Checkbox defaultChecked>Check-box</Checkbox>
      <Checkbox disabled>Check-box</Checkbox>
      <Checkbox defaultChecked disabled>
        Check-box
      </Checkbox>
      <Checkbox aria-label="Icon checkbox" />
    </div>
  ),
}
