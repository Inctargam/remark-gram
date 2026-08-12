import { ROUTES } from '@/shared/config'

type ProfilePostUrlParams = {
  searchParams: Pick<URLSearchParams, 'toString'>
  userId: string
  postId?: string | null
}

export const buildProfilePostUrl = ({ searchParams, userId, postId }: ProfilePostUrlParams) => {
  const nextSearchParams = new URLSearchParams(searchParams.toString())

  if (postId) {
    nextSearchParams.set('postId', postId)
  } else {
    nextSearchParams.delete('postId')
  }

  const queryString = nextSearchParams.toString()

  return `${ROUTES.profileById(userId)}${queryString ? `?${queryString}` : ''}`
}
