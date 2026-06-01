import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite'

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

export const AllStates: Story = {
  render: () => (
    <div className={styles.allStates}>
      <div className={styles.state}>
        <span className={styles.stateLabel}>Checked</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          name="radio-group-all-states-checked"
          options={options}
        />
      </div>

      <div className={`${styles.state} ${styles.hoverState}`}>
        <span className={styles.stateLabel}>Hover</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          name="radio-group-all-states-hover"
          options={options}
        />
      </div>

      <div className={`${styles.state} ${styles.focusState}`}>
        <span className={styles.stateLabel}>Focus</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          name="radio-group-all-states-focus"
          options={options}
        />
      </div>

      <div className={`${styles.state} ${styles.activeState}`}>
        <span className={styles.stateLabel}>Active</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          name="radio-group-all-states-active"
          options={options}
        />
      </div>

      <div className={styles.state}>
        <span className={styles.stateLabel}>Disabled</span>
        <RadioGroup
          defaultValue="checked"
          direction="horizontal"
          disabled
          name="radio-group-all-states-disabled"
          options={options}
        />
      </div>

      <div className={styles.state}>
        <span className={styles.stateLabel}>Vertical</span>
        <RadioGroup
          defaultValue="checked"
          direction="vertical"
          name="radio-group-all-states-vertical"
          options={options}
        />
      </div>
    </div>
  ),
}
