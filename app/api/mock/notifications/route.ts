import { withMockDelay } from '../_mock/mockDelay'
import { getNotificationsHandler } from './_mock/notificationsHandlers'

export const GET = withMockDelay(getNotificationsHandler)
