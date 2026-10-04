'use client'

import { useRouter } from 'next/navigation'
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection'
import { locationHref, rememberReviewOrigin } from './review-navigation'
import { ReviewNotifications } from './review-notifications'

type AddReviewSectionProps = { locationId: string }

export function AddReviewSection({ locationId }: AddReviewSectionProps) {
  const router = useRouter()

  function openReview() {
    rememberReviewOrigin(locationId)
    router.push(`${locationHref(locationId)}/review`, { scroll: false })
  }

  return (
    <>
      <ReviewsSection locationId={locationId} onLeaveReview={openReview} />
      <ReviewNotifications />
    </>
  )
}
