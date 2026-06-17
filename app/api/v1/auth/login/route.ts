/**
 * Mock login endpoint — delete this file when the real backend is connected.
 * Simulates the POST /v1/auth/login endpoint.
 *
 * Simulate errors by passing X-Mock-Scenario request header:
 *   'wrong-credentials' → 401 "Invalid email or password"
 *   anything else        → 204 success
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const scenario = request.headers.get('X-Mock-Scenario')

  if (scenario === 'wrong-credentials') {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
  }

  return new NextResponse(null, { status: 204 })
}
