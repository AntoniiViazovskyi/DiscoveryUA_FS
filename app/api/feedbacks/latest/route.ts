import { AxiosError } from 'axios'
import { NextResponse } from 'next/server'

import { api } from '../../api'

type ApiError = AxiosError<{ error?: string }>

export async function GET(): Promise<Response> {
  try {
    const { data } = await api.get<unknown>('/feedbacks/latest')
    return NextResponse.json(data)
  } catch (error) {
    const axiosError = error as ApiError
    const status = axiosError.response?.status ?? 500

    return NextResponse.json(
      { error: axiosError.response?.data?.error ?? axiosError.message },
      { status },
    )
  }
}