import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'

import { Modal } from './Modal'

const meta = {
  title: 'shared/ui/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Универсальная модалка на базе @base-ui/react Dialog. ' +
          'Управляется извне через open/onOpenChange. ' +
          'Поддерживает отключение закрытия по клику вне модалки через disablePointerDismissal.',
      },
    },
  },
} satisfies Meta<typeof Modal>

export default meta

/** Модалка с кнопкой открытия — основной сценарий использования. */
export const Default: StoryObj<typeof Modal> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onOpenChange={setOpen} title="Modal Title">
          <p style={{ margin: 0, color: 'white' }}>Modal content goes here</p>
        </Modal>
      </>
    )
  },
}

/** Модалка с disablePointerDismissal — закрывается только крестиком. */
export const DisablePointerDismissal: StoryObj<typeof Modal> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onOpenChange={setOpen} title="Confirm Action" disablePointerDismissal>
          <p style={{ margin: 0, color: 'white' }}>
            Клик по backdrop не закрывает эту модалку. Только крестик.
          </p>
        </Modal>
      </>
    )
  },
}

/** Модалка с кнопками действий — пример confirm-диалога. */
export const WithActions: StoryObj<typeof Modal> = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onOpenChange={(o) => {
            if (!o) setOpen(false)
          }}
          title="Log Out"
          disablePointerDismissal>
          <p style={{ margin: '0 0 24px', color: 'white' }}>
            Are you really want to log out of your account{' '}
            <strong>&quot;Epam@epam.com&quot;</strong>?
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'end' }}>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Yes
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              No
            </Button>
          </div>
        </Modal>
      </>
    )
  },
}
