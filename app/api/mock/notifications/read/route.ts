import { withMockDelay } from '../../_mock/mockDelay'
import { markNotificationsReadHandler } from '../_mock/notificationsHandlers'

export const POST = withMockDelay(markNotificationsReadHandler)
