import { withMockDelay } from '../../../../_mock/mockDelay'
import { completeCheckoutSessionHandler } from '../../../_mock/subscriptionsHandlers'

type CompleteCheckoutRouteContext = {
  params: Promise<{ sessionId: string }>
}

export const POST = withMockDelay(
  async (request: Request, { params }: CompleteCheckoutRouteContext) => {
    const { sessionId } = await params

    return completeCheckoutSessionHandler(request, sessionId)
  }
)
