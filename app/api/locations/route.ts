import { isAxiosError } from 'axios'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { api } from '../api'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  try {
    const formData = await request.formData()

    const response = await api.post('/locations', formData, {
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cookieStore = await cookies()
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 10)
  const region = searchParams.get('region') ?? ''
  const type = searchParams.get('type') ?? ''
  const search = searchParams.get('search') ?? ''
  const rate = searchParams.get('rate')
  const sortBy = searchParams.get('sortBy') ?? 'rate'
  const sortOrder = searchParams.get('sortOrder') ?? 'desc'

  try {
    const response = await api('/locations', {
      params: {
        page,
        limit,
        ...(region && { region }),
        ...(type && { type }),
        ...(search && { search }),
        ...(rate && { rate }),
        sortBy,
        sortOrder,
      },
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
