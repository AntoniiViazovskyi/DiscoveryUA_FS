import 'server-only'

import { cookies } from 'next/headers'

import { api } from '@/app/api/api'
import type { LocationsHttpResponse } from '@/types/location'

export async function fetchAllLocations(
  page: number = 1,
  limit: number = 10,
  region?: string,
  type?: string,
  search?: string,
  rate?: number,
  sortBy: 'rate' | 'name' = 'rate',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<LocationsHttpResponse> {
  const cookieStore = await cookies()
  const response = await api.get<LocationsHttpResponse>('/locations', {
    params: {
      page,
      limit,
      region,
      type,
      search,
      rate,
      sortBy,
      sortOrder,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  })

  return response.data
}
