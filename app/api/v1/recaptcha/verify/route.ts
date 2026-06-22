import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

interface VerifyRequest {
  token: string
  action?: string
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as VerifyRequest

  if (!body.token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  const projectId = process.env.RECAPTCHA_PROJECT_ID
  const apiKey = process.env.RECAPTCHA_API_KEY

  if (!projectId || !apiKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`

  const response = await fetch(url, {
    body: JSON.stringify({
      event: {
        action: body.action ?? 'default',
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        token: body.token,
      },
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: 'Assessment failed', details: data }, { status: 502 })
  }

  return NextResponse.json({
    score: data.riskAnalysis?.score,
    success: data.tokenProperties?.valid,
  })
}
