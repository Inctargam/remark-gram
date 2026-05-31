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
  // Storybook 10 viewport parameters do not resize the canvas as expected.
  // A decorator wrapper is the reliable way to constrain mobile component width.
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

// No additional args needed — the component has a single visual state.
export const Default: Story = {}
