/**
 * Mock resend registration email endpoint — delete when real backend is connected.
 * POST /v1/auth/resend-registration-email
 * Body: { email: string, baseUrl: string }
 */
import { NextResponse } from 'next/server'

export function POST() {
  return new NextResponse(null, { status: 204 })
}
