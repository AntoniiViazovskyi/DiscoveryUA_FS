'use client'

import { AddReviewEntry } from '@/components/AddReviewModal/add-review-entry'

type ReviewRouteModalProps = {
  locationId: string
  isAuthenticated: boolean
}

export default function ReviewRouteModal({
  locationId,
  isAuthenticated,
}: ReviewRouteModalProps) {
  return (
    <AddReviewEntry
      locationId={locationId}
      isAuthenticated={isAuthenticated}
      intercepted
    />
  )
}
