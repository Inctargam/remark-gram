import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'

import { ConfirmDialog } from './ConfirmDialog'

const meta = {
  title: 'shared/ui/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Диалог подтверждения поверх `Modal`.',
          '',
          'Компонент управляемый: состояние `open` держит родитель.',
          'Любое закрытие — кнопка отмены, крестик, `Escape` — проходит через `onCancel` и `onOpenChange(false)`.',
          'Подтверждение вызывает `onConfirm` и следом `onOpenChange(false)`.',
          'Если действие асинхронное — `closeOnConfirm={false}`: диалог останется на экране,',
          'и закроет его владелец, когда запрос завершится успехом.',
          '',
          '`disablePointerDismissal` включён по умолчанию: на вопрос надо ответить, а не закрыть его случайным кликом мимо.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    confirmLabel: { description: 'Текст кнопки подтверждения. По умолчанию `Yes`.' },
    cancelLabel: { description: 'Текст кнопки отмены. По умолчанию `No`.' },
    message: { description: 'Тело диалога. Принимает ReactNode, не только строку.' },
    closeOnConfirm: {
      description: 'Закрывать ли диалог сразу после подтверждения. По умолчанию `true`.',
    },
  },
  args: {
    open: true,
    title: 'Delete Post',
    message: 'Are you sure you want to delete this post?',
    onConfirm: fn(),
    onCancel: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

/** Открытый диалог с дефолтными подписями кнопок. */
export const Default: Story = {}

/** Свои подписи кнопок. */
export const CustomLabels: Story = {
  args: {
    title: 'Discard changes',
    message:
      'Do you really want to finish editing? If you close the changes you have made will not be saved',
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  },
}

/** Подтверждение вызывает onConfirm и просит родителя закрыть диалог. */
export const Confirms: Story = {
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(args.onCancel).not.toHaveBeenCalled()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** С closeOnConfirm={false} диалог остаётся открытым — закрывает его владелец. */
export const KeepsOpenOnConfirm: Story = {
  args: {
    closeOnConfirm: false,
  },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(screen.getByRole('dialog')).toBeVisible()
  },
}

/** Отмена не вызывает onConfirm. */
export const Cancels: Story = {
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'No' }))

    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** Крестик ведёт себя как отмена. */
export const ClosesByX: Story = {
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** Escape ведёт себя как отмена. */
export const ClosesOnEscape: Story = {
  play: async ({ args }) => {
    await userEvent.keyboard('{Escape}')

    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}
