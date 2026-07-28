'use client'

import { useRouter } from 'next/navigation'

import { CreatePostFlow } from '@/features/create-post'
import { ROUTES } from '@/shared/config'

export const CreatePostPage = () => {
  const router = useRouter()

  const closeHandler = () => {
    router.replace(ROUTES.profile)
  }

  return <CreatePostFlow onClose={closeHandler} />
}
