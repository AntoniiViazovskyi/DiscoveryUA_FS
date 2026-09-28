import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const sessionId = request.cookies.get('sessionId')?.value

  if (!accessToken || !sessionId) {
    return Response.json({ message: 'Not authorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const backendOrigin = process.env.BACKEND_ORIGIN

  if (!backendOrigin) {
    return Response.json(
      { message: 'Backend is not configured' },
      { status: 503 },
    )
  }

  let backendUrl: URL

  try {
    backendUrl = new URL('/api/feedbacks', backendOrigin)

    if (!['http:', 'https:'].includes(backendUrl.protocol)) {
      throw new Error('Unsupported backend protocol')
    }

    if (backendUrl.origin === request.nextUrl.origin) {
      throw new Error('Backend origin points to the frontend')
    }
  } catch {
    return Response.json(
      { message: 'Backend is not configured' },
      { status: 503 },
    )
  }

  let backendResponse: Response

  try {
    backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `accessToken=${encodeURIComponent(accessToken)}; sessionId=${encodeURIComponent(sessionId)}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return Response.json(
      { message: 'Backend is unavailable' },
      { status: 502 },
    )
  }

  if (!backendResponse.headers.get('content-type')?.includes('application/json')) {
    return Response.json(
      { message: 'Invalid backend response' },
      { status: 502 },
    )
  }

  let result: unknown

  try {
    result = await backendResponse.json()
  } catch {
    return Response.json(
      { message: 'Invalid backend response' },
      { status: 502 },
    )
  }

  if (backendResponse.status >= 500) {
    return Response.json(
      { message: 'Backend request failed' },
      { status: backendResponse.status },
    )
  }

  return Response.json(result, { status: backendResponse.status })
}
