import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'

import { Pagination, PaginationProps } from './Pagination'

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#171717' }],
    },
  },
  argTypes: {
    onPageChange: { action: 'page changed' },
    onItemsPerPageChange: { action: 'items per page changed' },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

// ─────────────────────────────────────────────────────────────
// Controlled wrapper (storybook-safe)
// ─────────────────────────────────────────────────────────────

function Controlled(props: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(props.currentPage)
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage)

  // важно: синхронизация при смене args в Storybook
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(props.currentPage)
  }, [props.currentPage])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItemsPerPage(props.itemsPerPage)
  }, [props.itemsPerPage])

  return (
    <Pagination
      {...props}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={(page) => {
        setCurrentPage(page)
        props.onPageChange?.(page)
      }}
      onItemsPerPageChange={(value) => {
        setItemsPerPage(value)
        setCurrentPage(1)
        props.onItemsPerPageChange?.(value)
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// Playground (главная история — для теста всего)
// ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    currentPage: 1,
    totalPages: 55,
    itemsPerPage: 10,
    itemsPerPageOptions: [10, 20, 30, 50, 100],
  },
  render: (args) => <Controlled {...args} />,
}

// ─────────────────────────────────────────────────────────────
// Preset stories (кейсы UI)
// ─────────────────────────────────────────────────────────────

export const Start: Story = {
  args: {
    currentPage: 1,
    totalPages: 55,
    itemsPerPage: 100,
  },
  render: (args) => <Controlled {...args} />,
}

export const Middle: Story = {
  args: {
    currentPage: 7,
    totalPages: 55,
    itemsPerPage: 100,
  },
  render: (args) => <Controlled {...args} />,
}

export const End: Story = {
  args: {
    currentPage: 55,
    totalPages: 55,
    itemsPerPage: 100,
  },
  render: (args) => <Controlled {...args} />,
}

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    itemsPerPage: 10,
  },
  render: (args) => <Controlled {...args} />,
}

export const SevenPagesBoundary: Story = {
  args: {
    currentPage: 4,
    totalPages: 7,
    itemsPerPage: 10,
  },
  render: (args) => <Controlled {...args} />,
}

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  },
  render: (args) => <Controlled {...args} />,
}
