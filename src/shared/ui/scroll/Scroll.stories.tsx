import type { Meta, StoryObj } from '@storybook/react'

import { Scroll } from './Scroll'
import styles from './scroll.stories.module.css'

const ITEMS = Array.from({ length: 24 }, (_, index) => `Notification ${index + 1}`)

const meta = {
  title: 'shared/ui/Scroll',
  component: Scroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Controls which custom scrollbars are rendered.',
    },
  },
  args: {
    children: null,
    orientation: 'vertical',
  },
} satisfies Meta<typeof Scroll>

export default meta

type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: (args) => (
    <Scroll {...args} className={styles.vertical}>
      <div className={styles.list}>
        {ITEMS.map((item) => (
          <div className={styles.item} key={item}>
            <span>{item}</span>
            <span className={styles.time}>Today</span>
          </div>
        ))}
      </div>
    </Scroll>
  ),
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <Scroll {...args} className={styles.horizontal}>
      <div className={styles.row}>
        {Array.from({ length: 16 }, (_, index) => (
          <span className={styles.badge} key={index}>
            Item {index + 1}
          </span>
        ))}
      </div>
    </Scroll>
  ),
}

export const BothAxes: Story = {
  args: {
    orientation: 'both',
  },
  render: (args) => (
    <Scroll {...args} className={styles.gridFrame}>
      <div className={styles.grid}>
        {Array.from({ length: 80 }, (_, index) => (
          <span className={styles.cell} key={index}>
            {index + 1}
          </span>
        ))}
      </div>
    </Scroll>
  ),
}
