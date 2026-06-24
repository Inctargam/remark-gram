'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/shared/config'

import { CreatePostModal } from './CreatePostModal'

export const CreatePostPage = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const closeHandler = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      router.replace(ROUTES.profile)
    }
  }

  return <CreatePostModal open={isOpen} onOpenChange={closeHandler} />
}
