/**
 * Mock email confirmation endpoint — delete when real backend is connected.
 * GET /v1/auth/registration-confirmation?code=<token>
 *
 * Simulate expired link by using code='expired'.
 * Any other non-empty code returns 204 success.
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code || code === 'expired') {
    return NextResponse.json(
      { message: 'Verification link has expired or is invalid' },
      { status: 400 }
    )
  }

  return new NextResponse(null, { status: 204 })
}
