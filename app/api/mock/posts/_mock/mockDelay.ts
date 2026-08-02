/**
 * Artificial latency for the mock posts API.
 *
 * The in-memory store answers instantly, so loading states — grid skeletons, the disabled
 * confirm button, `isFetchingNextPage` — flash by and cannot be checked by hand. Set
 * `POSTS_API_MOCK_DELAY_MS` in `.env.local` to slow the mock down while testing manually.
 *
 * Off by default on purpose: unit tests and story runs must not wait for it.
 */
const DELAY_ENV_VAR = 'POSTS_API_MOCK_DELAY_MS'

/** Invalid or negative values are ignored rather than crashing a mock handler. */
export const parseMockDelay = (rawDelay: string | undefined): number => {
  if (!rawDelay) {
    return 0
  }

  const delay = Number(rawDelay)

  return Number.isFinite(delay) && delay > 0 ? delay : 0
}

/** Read at call time, not at module load, so the dev server picks up env changes on reload. */
const getMockDelay = () => parseMockDelay(process.env[DELAY_ENV_VAR])

export const waitMockDelay = async (): Promise<void> => {
  const delay = getMockDelay()

  if (delay === 0) {
    return
  }

  await new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Wraps a route handler so every mock response waits out the configured delay.
 * Applied in `route.ts`, which keeps the handlers themselves free of test-only timing.
 */
export const withMockDelay =
  <Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) =>
  async (...args: Args): Promise<Response> => {
    await waitMockDelay()

    return handler(...args)
  }
