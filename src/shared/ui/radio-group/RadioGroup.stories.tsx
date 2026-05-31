import type { Decorator, Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './RadioGroup'
import styles from './radioGroup.stories.module.css'

const options = [
  { label: 'Checked option', value: 'checked' },
  { label: 'Off option', value: 'off' },
]

const meta = {
  title: 'shared/ui/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
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

const withState = (className: string): Decorator =>
  function StateDecorator(Story) {
    return (
      <div className={className}>
        <Story />
      </div>
    )
  }

export const Checked: Story = {
  args: {
    defaultValue: 'checked',
  },
}

export const Hover: Story = {
  args: {
    defaultValue: 'checked',
  },
  decorators: [withState(styles.hoverState)],
}

export const Focus: Story = {
  args: {
    defaultValue: 'checked',
  },
  decorators: [withState(styles.focusState)],
}

export const Active: Story = {
  args: {
    defaultValue: 'checked',
  },
  decorators: [withState(styles.activeState)],
}

export const Disabled: Story = {
  args: {
    defaultValue: 'checked',
    disabled: true,
  },
}

export const Vertical: Story = {
  args: {
    defaultValue: 'checked',
    direction: 'vertical',
  },
}
