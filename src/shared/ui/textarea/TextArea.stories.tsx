import type { Decorator, Meta, StoryObj } from '@storybook/react'

import { TextArea } from './TextArea'
import styles from './textArea.stories.module.css'

const meta = {
  title: 'shared/ui/TextArea',
  component: TextArea,
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
  args: {
    label: 'Text-area',
    placeholder: 'Text-area',
  },
} satisfies Meta<typeof TextArea>

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

export const Default: Story = {}

export const Error: Story = {
  args: {
    defaultValue: 'Text-area',
    error: 'Error text',
  },
}

export const Active: Story = {
  args: {
    defaultValue: 'Text-area',
  },
  decorators: [withState(styles.activeState)],
}

export const Hover: Story = {
  decorators: [withState(styles.hoverState)],
}

export const Focus: Story = {
  args: {
    defaultValue: 'Text-area',
  },
  decorators: [withState(styles.focusState)],
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
