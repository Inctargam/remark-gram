'use client'

import { Select } from '@base-ui/react/select'
import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

import { Icon } from '@/shared/ui/icon'

import s from './Pagination.module.css'

export type PaginationProps = {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  itemsPerPageOptions?: number[]
  onPageChange: (page: number) => void
  onItemsPerPageChange: (value: number) => void
  className?: string
}

const DEFAULT_OPTIONS = [10, 20, 30, 50, 100]

// ─── Pagination logic ──────────────────────────────────────────────────

function buildPages(current: number, total: number): (number | '…')[] {
  const pages: (number | '…')[] = []

  const add = (value: number | '…') => {
    if (pages[pages.length - 1] !== value) {
      pages.push(value)
    }
  }

  const firstPage = 1
  const lastPage = total

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const isNearStart = current <= 4
  const isNearEnd = current >= total - 3

  if (isNearStart) {
    for (let page = firstPage; page <= 5; page++) {
      add(page)
    }

    add('…')
    add(lastPage)

    return pages
  }

  if (isNearEnd) {
    add(firstPage)
    add('…')

    for (let page = lastPage - 4; page <= lastPage; page++) {
      add(page)
    }

    return pages
  }

  add(firstPage)
  add('…')

  for (let page = current - 1; page <= current + 1; page++) {
    add(page)
  }

  add('…')
  add(lastPage)

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  itemsPerPageOptions = DEFAULT_OPTIONS,
  onPageChange,
  onItemsPerPageChange,
  className,
}: PaginationProps) {
  const pages = useMemo(() => buildPages(currentPage, totalPages), [currentPage, totalPages])

  const goTo = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      if (page === currentPage) return
      onPageChange?.(page)
    },
    [currentPage, totalPages, onPageChange]
  )

  if (totalPages <= 0) return null

  return (
    <nav className={clsx(s.root, className)} aria-label="Pagination">
      {/* Prev */}
      <button
        type="button"
        className={s.arrow}
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page">
        <Icon iconId="icon-arrow-ios-back" width={24} height={24} className={s.arrowIcon} />
      </button>

      {/* Pages */}
      <ol className={s.list}>
        {pages.map((page, idx) =>
          page === '…' ? (
            <li key={`dots-${idx}`} className={s.dots}>
              …
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                className={clsx(s.page, {
                  [s.pageActive]: page === currentPage,
                })}
                onClick={() => goTo(page)}
                aria-current={page === currentPage ? 'page' : undefined}>
                {page}
              </button>
            </li>
          )
        )}
      </ol>

      {/* Next */}
      <button
        type="button"
        className={s.arrow}
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page">
        <Icon iconId="icon-arrow-ios-forward" width={24} height={24} />
      </button>

      {/* Items per page */}
      <div className={s.perPage}>
        <span className={s.perPageText}>Show</span>

        <Select.Root
          value={itemsPerPage}
          onValueChange={(value: number | null) => {
            if (value !== null) onItemsPerPageChange?.(value)
          }}>
          <Select.Trigger className={s.selectTrigger}>
            <Select.Value className={s.selectValue} />
            <Select.Icon className={s.selectIcon}>
              <Icon iconId="icon-arrow-ios-down-outline" width={24} height={24} />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Positioner alignItemWithTrigger={false}>
              <Select.Popup className={s.selectPopup}>
                {itemsPerPageOptions.map((opt) => (
                  <Select.Item key={opt} value={opt} className={s.selectItem}>
                    <Select.ItemText>{opt}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>

        <span className={s.perPageText}>on page</span>
      </div>
    </nav>
  )
}
