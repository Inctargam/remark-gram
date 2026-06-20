/**
 * Mock registration endpoint — delete this file when the real backend is connected.
 * Simulates the POST /v1/auth/registration endpoint.
 *
 * Simulate errors by passing X-Mock-Scenario request header:
 *   'email-taken'    → 400 "User with this email is already registered"
 *   'username-taken' → 400 "User with this username is already registered"
 *   anything else   → 204 success
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const scenario = request.headers.get('X-Mock-Scenario')

  if (scenario === 'email-taken') {
    return NextResponse.json(
      { message: 'User with this email is already registered' },
      { status: 400 }
    )
  }

  if (scenario === 'username-taken') {
    return NextResponse.json(
      { message: 'User with this username is already registered' },
      { status: 400 }
    )
  }

  return new NextResponse(null, { status: 204 })
}
