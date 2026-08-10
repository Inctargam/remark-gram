import type { Meta, StoryObj } from '@storybook/react'

import { Table } from './Table'

const COLUMNS = [
  'Date of Payment',
  'End date of subscription',
  'Price',
  'Subscription Type',
  'Payment Method',
]

const PAYMENTS = [
  {
    id: '1',
    date: '12.12.2022',
    endDate: '12.01.2023',
    price: '$10',
    type: '1 month',
    method: 'Stripe',
  },
  {
    id: '2',
    date: '12.11.2022',
    endDate: '12.12.2022',
    price: '$10',
    type: '1 month',
    method: 'PayPal',
  },
  {
    id: '3',
    date: '05.11.2022',
    endDate: '12.11.2022',
    price: '$5',
    type: '7 days',
    method: 'Stripe',
  },
]

const meta = {
  title: 'shared/ui/Table',
  component: Table.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Составной компонент таблицы для табличных данных (платежи, текущая подписка).',
          '',
          '## Состав',
          '- **Table.Root** — `<table>` внутри контейнера с горизонтальным скроллом. `wrapperClassName` — класс контейнера, `className` — класс самой таблицы.',
          '- **Table.Head** / **Table.Body** — `<thead>` / `<tbody>`.',
          '- **Table.Row** — `<tr>`.',
          '- **Table.HeadCell** — `<th>`, по умолчанию `scope="col"`.',
          '- **Table.Cell** — `<td>`.',
          '- **Table.Empty** — строка-заглушка на всю ширину. Обязательный `colSpan` = число колонок.',
          '- **Table.Skeleton** — строки-заглушки на время загрузки. `columns` — число колонок, `rows` — число строк (по умолчанию 3).',
          '',
          '## Загрузка',
          'Скелетон скрыт от скринридеров (`aria-hidden`), поэтому состояние загрузки объявляется через `aria-busy` на `Table.Root`.',
          '',
          '## Узкие экраны',
          'Таблица не сжимается: контейнер прокручивается по горизонтали, заголовки не переносятся.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Table.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.HeadCell key={column}>{column}</Table.HeadCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {PAYMENTS.map((payment) => (
          <Table.Row key={payment.id}>
            <Table.Cell>{payment.date}</Table.Cell>
            <Table.Cell>{payment.endDate}</Table.Cell>
            <Table.Cell>{payment.price}</Table.Cell>
            <Table.Cell>{payment.type}</Table.Cell>
            <Table.Cell>{payment.method}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
}

export const Loading: Story = {
  render: () => (
    <Table.Root aria-busy="true">
      <Table.Head>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.HeadCell key={column}>{column}</Table.HeadCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Skeleton columns={COLUMNS.length} />
      </Table.Body>
    </Table.Root>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.HeadCell key={column}>{column}</Table.HeadCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Empty colSpan={COLUMNS.length}>You don&apos;t have any payments yet</Table.Empty>
      </Table.Body>
    </Table.Root>
  ),
}

/** Две колонки — так выглядит блок Current subscription на вкладке Account Management. */
export const CurrentSubscription: Story = {
  render: () => (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell>Expire at</Table.HeadCell>
          <Table.HeadCell>Next payment</Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>12.12.2022</Table.Cell>
          <Table.Cell>13.12.2022</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
}

/** Контейнер уже таблицы — содержимое прокручивается по горизонтали. */
export const HorizontalScroll: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            {COLUMNS.map((column) => (
              <Table.HeadCell key={column}>{column}</Table.HeadCell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {PAYMENTS.map((payment) => (
            <Table.Row key={payment.id}>
              <Table.Cell>{payment.date}</Table.Cell>
              <Table.Cell>{payment.endDate}</Table.Cell>
              <Table.Cell>{payment.price}</Table.Cell>
              <Table.Cell>{payment.type}</Table.Cell>
              <Table.Cell>{payment.method}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  ),
}
