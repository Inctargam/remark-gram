import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CloseCreationConfirm } from './CloseCreationConfirm'

const meta = {
  title: 'pages/CreatePostFlow/CloseCreationConfirm',
  component: CloseCreationConfirm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        iframeHeight: 360,
        inline: false,
      },
    },
  },
  args: {
    open: true,
    onDiscard: () => undefined,
    onOpenChange: () => undefined,
    onSaveDraft: () => undefined,
  },
} satisfies Meta<typeof CloseCreationConfirm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
