import { isAxiosError } from 'axios'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { api } from '../../api'

type RouteProps = {
  params: Promise<{ locationId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const { locationId } = await params
  const cookieStore = await cookies()

  try {
    const formData = await request.formData()

    const response = await api.patch(`/locations/${locationId}`, formData, {
      headers: {
        Cookie: cookieStore.toString(),
      },
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

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { locationId } = await params
  const cookieStore = await cookies()

  try {
    const response = await api(`/locations/${locationId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
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
