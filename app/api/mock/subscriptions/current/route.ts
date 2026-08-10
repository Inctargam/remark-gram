import { withMockDelay } from '../../_mock/mockDelay'
import { getCurrentSubscriptionHandler } from '../_mock/subscriptionsHandlers'

export const GET = withMockDelay(getCurrentSubscriptionHandler)
