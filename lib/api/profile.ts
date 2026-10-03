import 'server-only'

import { isAxiosError } from 'axios'
import { cookies } from 'next/headers'

import { api } from '@/app/api/api'
import type { Location } from '@/types/location'
import type { PublicUser } from '@/types/user'

type ApiResponse<T> = {
  data: T
}

export type UserLocationsResponse = {
  data: Location[]
  total: number
  totalPages: number
}

export class ProfileApiUnavailableError extends Error {
  constructor() {
    super('The profile service could not be reached.')
    this.name = 'ProfileApiUnavailableError'
  }
}

function rethrowProfileError(error: unknown): never {
  if (isAxiosError(error) && !error.response) {
    throw new ProfileApiUnavailableError()
  }

  throw error
}

async function getCookieHeader() {
  const cookieStore = await cookies()
  return cookieStore.toString()
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  try {
    const response = await api.get<ApiResponse<PublicUser>>('/users/me', {
      headers: { Cookie: await getCookieHeader() },
      timeout: 10_000,
    })

    return response.data.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null
    }

    rethrowProfileError(error)
  }
}

export async function getPublicUser(
  userId: string,
): Promise<PublicUser | null> {
  try {
    const response = await api.get<ApiResponse<PublicUser>>(
      `/users/${encodeURIComponent(userId)}`,
      {
        headers: { Cookie: await getCookieHeader() },
        timeout: 10_000,
      },
    )

    return response.data.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null
    }

    rethrowProfileError(error)
  }
}

export async function getUserLocations(
  userId: string,
  page: number,
): Promise<UserLocationsResponse> {
  try {
    const response = await api.get<UserLocationsResponse>(
      `/users/${encodeURIComponent(userId)}/locations`,
      {
        params: { page, limit: 12 },
        headers: { Cookie: await getCookieHeader() },
        timeout: 10_000,
      },
    )

    return response.data
  } catch (error) {
    rethrowProfileError(error)
  }
}
