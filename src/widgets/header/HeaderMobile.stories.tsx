import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { HeaderMobile } from './HeaderMobile'

const meta = {
  title: 'widgets/HeaderMobile',
  component: HeaderMobile,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onMenuClick: { description: 'Коллбэк кнопки открытия меню' },
  },
  args: {
    onMenuClick: fn(),
  },
} satisfies Meta<typeof HeaderMobile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
