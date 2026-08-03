import { getRegisteredUsersCount } from '@/shared/api/mock/usersCountStore'

export const getUsersCountHandler = async () => {
  const totalCount = getRegisteredUsersCount()

  return Response.json({ totalCount })
}
