import { withMockDelay } from '../_mock/mockDelay'
import { getPaymentsHandler } from './_mock/paymentsHandler'

export const GET = withMockDelay(getPaymentsHandler)
