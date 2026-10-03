import { isAxiosError } from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { api } from '../../api'

export async function GET() {
  const cookieStore = await cookies()

  try {
    const response = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
      timeout: 10_000,
    })

    return NextResponse.json(response.data, {
      status: response.status,
    })
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status ?? 502,
        },
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
