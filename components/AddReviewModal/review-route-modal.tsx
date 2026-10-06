'use client'

import { AddReviewEntry } from '@/components/AddReviewModal/add-review-entry'

type ReviewRouteModalProps = {
  locationId: string
  locationName: string
  isAuthenticated: boolean
}

export default function ReviewRouteModal({
  locationId,
  locationName,
  isAuthenticated,
}: ReviewRouteModalProps) {
  return (
    <AddReviewEntry
      locationId={locationId}
      locationName={locationName}
      isAuthenticated={isAuthenticated}
      intercepted
    />
  )
}
