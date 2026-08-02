import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'

import { DropdownMenu } from './DropdownMenu'

const meta = {
  title: 'shared/ui/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Выпадающее меню на `@base-ui/react/menu`.',
          '',
          'Триггер — `<button>`; по умолчанию рисуется иконка «три точки».',
          'Своё содержимое триггера передаётся через проп `trigger`.',
          '',
          '## Доступность',
          '- `ariaLabel` обязателен: дефолтный триггер иконочный, текста для имени нет.',
          '- Клавиатура работает из коробки: `Enter`/`Space` открывают, стрелки двигают подсветку, `Escape` закрывает.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    items: { description: 'Пункты меню. `onSelect` вызывается по клику, меню закрывается само.' },
    ariaLabel: { description: 'Доступное имя кнопки-триггера.' },
    trigger: { description: 'Содержимое триггера. По умолчанию — иконка icon-more-horizontal.' },
  },
  args: {
    ariaLabel: 'Post actions',
    items: [
      { id: 'edit', label: 'Edit Post', iconId: 'icon-edit-2-outline', onSelect: fn() },
      {
        id: 'delete',
        label: 'Delete Post',
        iconId: 'icon-trash-outline',
        onSelect: fn(),
        danger: true,
      },
    ],
  },
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

/** Закрытое меню — виден только триггер. */
export const Default: Story = {}

/** Открывается по клику, пункты видны. */
export const OpensOnClick: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))

    await expect(await screen.findByRole('menu')).toBeInTheDocument()
    await expect(screen.getByRole('menuitem', { name: 'Edit Post' })).toBeInTheDocument()
    await expect(screen.getByRole('menuitem', { name: 'Delete Post' })).toBeInTheDocument()
  },
}

/** Выбор пункта вызывает его onSelect и закрывает меню. */
export const SelectsItem: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Edit Post' }))

    await expect(args.items[0].onSelect).toHaveBeenCalledOnce()
    await expect(args.items[1].onSelect).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  },
}

/** Enter открывает меню, стрелка вниз двигает подсветку на следующий пункт. */
export const KeyboardNavigation: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole('button', { name: 'Post actions' }).focus()
    await userEvent.keyboard('{Enter}')

    await expect(await screen.findByRole('menu')).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}')

    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Delete Post' })).toHaveAttribute(
        'data-highlighted'
      )
    )
  },
}

/** Escape закрывает меню. */
export const ClosesOnEscape: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await expect(await screen.findByRole('menu')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  },
}

/** Заблокированный пункт не вызывает onSelect. */
export const DisabledItem: Story = {
  args: {
    items: [
      { id: 'edit', label: 'Edit Post', iconId: 'icon-edit-2-outline', onSelect: fn() },
      {
        id: 'delete',
        label: 'Delete Post',
        iconId: 'icon-trash-outline',
        onSelect: fn(),
        danger: true,
        disabled: true,
      },
    ],
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete Post' }))

    await expect(args.items[1].onSelect).not.toHaveBeenCalled()
  },
}
