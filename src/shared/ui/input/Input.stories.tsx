import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './Input'

const meta = {
  title: 'shared/ui/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Поле ввода на основе `@base-ui/react`.',
          '',
          '## Варианты',
          '- **email** — текстовое поле для email.',
          '- **password** — с кнопкой показать/скрыть пароль.',
          '- **search** — поле для поиска.',
          '',
          '## Состояния',
          '- **default** — базовое.',
          '- **focus** — в фокусе.',
          '- **active** — с введённым текстом.',
          '- **invalid** — с ошибкой.',
          '- **disabled** — заблокировано.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 279 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Текст над полем ввода',
    },
    error: {
      control: 'text',
      description: 'Текст ошибки. При наличии включает состояние invalid.',
    },
    disabled: {
      control: 'boolean',
      description: 'Блокирует поле ввода.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder текст',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search'],
      description: 'Тип поля: text, email, password или search.',
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Email', placeholder: 'Epam@epam.com' },
}

export const Focus: Story = {
  args: { label: 'Email', placeholder: 'Epam@epam.com', autoFocus: true },
}

export const Active: Story = {
  args: { label: 'Email', defaultValue: 'Epam@epam.com', autoFocus: true },
}

export const ErrorState: Story = {
  args: { label: 'Email', defaultValue: 'Epam@epam.com', error: 'Error text' },
}

export const Disabled: Story = {
  args: { label: 'Email', placeholder: 'Epam@epam.com', disabled: true },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '**********',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Input search',
  },
}

export const SearchError: Story = {
  args: {
    type: 'search',
    defaultValue: 'Input search',
    error: 'Error text',
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: 279 }}>
      <Input label="Email" placeholder="Default" />
      <Input label="Email" defaultValue="Epam@epam.com" />
      <Input label="Email" defaultValue="Error" error="Error text" />
      <Input label="Email" placeholder="Disabled" disabled />
      <Input label="Password" type="password" placeholder="Password" />
      <Input type="search" placeholder="Input search" />
      <Input type="search" defaultValue="Input search" error="Error text" />
    </div>
  ),
}
