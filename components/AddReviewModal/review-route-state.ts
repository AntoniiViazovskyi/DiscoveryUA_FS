import 'server-only'

import { isAxiosError } from 'axios'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/api/profile'
import { fetchLocationById } from '@/lib/api/serverApi'

export async function getReviewRouteState(locationId: string) {
  if (!/^[a-f\d]{24}$/i.test(locationId)) notFound()

  let location
  try {
    location = await fetchLocationById(locationId)
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound()
    throw error
  }

  const user = await getCurrentUser()
  return {
    locationId,
    locationName: location.name,
    isAuthenticated: user !== null,
  }
}
