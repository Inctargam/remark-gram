import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '@/shared/ui/button'

import { EmailSentModal } from './EmailSentModal'

type ModalStoryProps = {
  email: string
}

const ModalStory = ({ email }: ModalStoryProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button">
        Open modal
      </Button>
      <EmailSentModal email={email} open={open} onOpenChange={setOpen} />
    </>
  )
}

const meta = {
  title: 'features/forgot-password/EmailSentModal',
  component: EmailSentModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    email: 'epam@epam.com',
    onOpenChange: () => undefined,
    open: false,
  },
  render: ({ email }) => <ModalStory email={email ?? ''} />,
} satisfies Meta<typeof EmailSentModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const documentBody = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))

    await expect(
      documentBody.getByText('We have sent a link to confirm your email to epam@epam.com')
    ).toBeInTheDocument()

    await userEvent.click(documentBody.getByRole('button', { name: 'OK' }))

    await waitFor(async () => {
      await expect(
        documentBody.queryByText('We have sent a link to confirm your email to epam@epam.com')
      ).not.toBeInTheDocument()
    })
  },
}
