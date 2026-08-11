import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'

import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'Shared/UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ProgressBar>

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const Idle: Story = {
  args: {
    isLoading: false,
  },
}

export const Interactive: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ProgressBar isLoading={isLoading} />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={() => setIsLoading(true)}>Start</Button>
          <Button variant="secondary" onClick={() => setIsLoading(false)}>
            Stop
          </Button>
        </div>
      </div>
    )
  },
}
