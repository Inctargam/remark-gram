import { listNotifications, markNotificationsAsRead } from '@/shared/api/mock/notificationsStore'

const DEFAULT_NOTIFICATIONS_LIMIT = 20
const MAX_NOTIFICATIONS_LIMIT = 50

const readLimit = (rawLimit: string | null): number => {
  const limit = Number(rawLimit ?? DEFAULT_NOTIFICATIONS_LIMIT)

  if (!Number.isInteger(limit) || limit <= 0) {
    return DEFAULT_NOTIFICATIONS_LIMIT
  }

  return Math.min(limit, MAX_NOTIFICATIONS_LIMIT)
}

export const getNotificationsHandler = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')
  const limit = readLimit(searchParams.get('limit'))

  return Response.json(listNotifications({ cursor, limit }))
}

type MarkReadRequestBody = {
  ids?: unknown
  all?: unknown
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

export const markNotificationsReadHandler = async (request: Request) => {
  const body: MarkReadRequestBody | null = await request.json().catch(() => null)

  if (body?.all !== undefined && typeof body.all !== 'boolean') {
    return Response.json({ message: 'all must be a boolean.' }, { status: 400 })
  }

  if (body?.ids !== undefined && !isStringArray(body.ids)) {
    return Response.json({ message: 'ids must be an array of strings.' }, { status: 400 })
  }

  if (body?.all !== true && body?.ids === undefined) {
    return Response.json({ message: 'Either all=true or ids must be provided.' }, { status: 400 })
  }

  return Response.json(markNotificationsAsRead({ all: body.all, ids: body.ids }))
}
