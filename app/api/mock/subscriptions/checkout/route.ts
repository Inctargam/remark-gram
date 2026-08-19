import { withMockDelay } from '../../_mock/mockDelay'
import { createCheckoutSessionHandler } from '../_mock/subscriptionsHandlers'

export const POST = withMockDelay(createCheckoutSessionHandler)
