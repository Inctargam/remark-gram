import { ROUTES } from '@/shared/config'

type ProfilePostUrlParams = {
  searchParams?: Pick<URLSearchParams, 'toString'>
  userId: string
  postId?: string | null
  returnTo?: string
}

type PostModalCloseUrlParams = {
  searchParams?: Pick<URLSearchParams, 'toString'>
  userId: string
}

export const buildProfilePostUrl = ({
  searchParams,
  userId,
  postId,
  returnTo,
}: ProfilePostUrlParams) => {
  const nextSearchParams = new URLSearchParams(searchParams?.toString())

  if (postId) {
    nextSearchParams.set('postId', postId)
  } else {
    nextSearchParams.delete('postId')
  }

  if (returnTo !== undefined) {
    if (returnTo === ROUTES.home) {
      nextSearchParams.set('returnTo', returnTo)
    } else {
      nextSearchParams.delete('returnTo')
    }
  }

  const queryString = nextSearchParams.toString()

  return `${ROUTES.profileById(userId)}${queryString ? `?${queryString}` : ''}`
}

export const buildPostModalCloseUrl = ({ searchParams, userId }: PostModalCloseUrlParams) => {
  const nextSearchParams = new URLSearchParams(searchParams?.toString())
  const returnTo = nextSearchParams.get('returnTo')

  if (returnTo === ROUTES.home) {
    return returnTo
  }

  nextSearchParams.delete('postId')
  nextSearchParams.delete('returnTo')

  const queryString = nextSearchParams.toString()

  return `${ROUTES.profileById(userId)}${queryString ? `?${queryString}` : ''}`
}
