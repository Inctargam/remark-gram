import type { Meta, StoryObj } from '@storybook/react'

import { DatePicker } from './DatePicker'

const meta = {
  title: 'shared/ui/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Компонент выбора даты с кастомным календарём.',
          '',
          '## Состав',
          '- **DatePicker** — триггер с выпадающим календарём.',
          '- **Calendar** — встроенный календарь с навигацией по месяцам.',
          '',
          '## Режимы',
          '- **single** — выбор одной даты.',
          '- **range** — выбор диапазона дат.',
          '',
          '## Состояния триггера',
          '- **default** — базовое.',
          '- **hover** — при наведении.',
          '- **focus** — в фокусе.',
          '- **active** — с выбранной датой.',
          '- **error** — с ошибкой.',
          '- **disabled** — заблокирован.',
          '',
          '## Календарь',
          '- **single** — клик выбирает дату.',
          '- **range** — первый клик задаёт начало, второй — конец.',
          '## Поведение',
          '- Клик на триггер открывает календарь.',
          '- В режиме `single` закрытие происходит после выбора даты.',
          '- В режиме `range` — после выбора второй даты.',
          '- Клик вне компонента закрывает календарь.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
      description: 'Режим выбора: single или range',
    },
    label: {
      control: 'text',
      description: 'Текст над полем выбора',
    },
    error: {
      control: 'text',
      description: 'Текст ошибки. При наличии включает состояние invalid.',
    },
    disabled: {
      control: 'boolean',
      description: 'Блокирует поле и календарь.',
    },
    placeholder: {
      control: 'text',
      description: 'Текст, когда дата не выбрана',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Открыть календарь при монтировании.',
    },
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Date select',
    placeholder: 'Select date',
  },
}

export const CalendarOpen: Story = {
  args: {
    label: 'Date select',
    defaultOpen: true,
  },
}

export const SingleWithValue: Story = {
  args: {
    label: 'Date select',
    value: new Date(),
  },
}

export const SingleError: Story = {
  args: {
    label: 'Date',
    value: new Date(),
    error: 'Error!',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Date select',
    placeholder: 'Select date',
    disabled: true,
  },
}

export const RangeDefault: Story = {
  args: {
    mode: 'range',
    label: 'Date range',
    placeholder: 'Select date range',
  },
}

export const RangeWithValue: Story = {
  args: {
    mode: 'range',
    label: 'Date range',
    value: { from: new Date(), to: new Date() },
  },
}

export const RangeError: Story = {
  args: {
    mode: 'range',
    label: 'Date range',
    value: { from: new Date(), to: new Date() },
    error: 'Error, select current month or last month',
  },
}

export const RangeDisabled: Story = {
  args: {
    mode: 'range',
    label: 'Date range',
    placeholder: 'Select date range',
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <DatePicker label="Date select" placeholder="Default" />
        <DatePicker label="Date select" value={new Date()} />
        <DatePicker label="Date" value={new Date()} error="Error!" />
        <DatePicker label="Date select" placeholder="Disabled" disabled />
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <DatePicker mode="range" label="Date range" placeholder="Default" />
        <DatePicker mode="range" label="Date range" value={{ from: new Date(), to: new Date() }} />
        <DatePicker
          mode="range"
          label="Date range"
          value={{ from: new Date(), to: new Date() }}
          error="Error, select current month or last month"
        />
        <DatePicker mode="range" label="Date range" placeholder="Disabled" disabled />
      </div>
    </div>
  ),
}
