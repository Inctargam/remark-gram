import { withMockDelay } from '../../_mock/mockDelay'
import { setAutoRenewalHandler } from '../_mock/subscriptionsHandlers'

export const PATCH = withMockDelay(setAutoRenewalHandler)
