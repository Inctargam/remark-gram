import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './RadioGroup'
import styles from './radioGroup.stories.module.css'

const options = [
  { label: 'RadioGroup', value: 'checked' },
  { label: 'RadioGroup', value: 'off' },
]

const meta = {
  title: 'shared/ui/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    direction: 'horizontal',
    name: 'radio-group-story',
    options,
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'checked',
  },
}

export const Active: Story = {
  args: {
    defaultValue: 'checked',
    itemClassName: styles.forceActive,
  },
}

export const Hover: Story = {
  args: {
    defaultValue: 'checked',
    itemClassName: styles.forceHover,
  },
}

export const Focus: Story = {
  args: {
    defaultValue: 'checked',
    itemClassName: styles.forceFocus,
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: 'checked',
    disabled: true,
  },
}
