'use client'

import type { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { DropdownMenu } from '@/shared/ui/dropdown-menu'

type Props = {
  onEdit: () => void
  onDelete: () => void
}

/**
 * Three-dot menu of a post — the single entry point into UC-2 (edit) and UC-3 (delete).
 * Ownership is not checked here: the caller renders the menu only for the post owner,
 * so the rule stays in one place instead of being repeated in every screen.
 */
export const PostActionsMenu = ({ onEdit, onDelete }: Props) => {
  const items: DropdownMenuItem[] = [
    { id: 'edit', label: 'Edit Post', iconId: 'icon-edit-2-outline', onSelect: onEdit },
    { id: 'delete', label: 'Delete Post', iconId: 'icon-trash-outline', onSelect: onDelete },
  ]

  return <DropdownMenu items={items} ariaLabel="Post actions" />
}
