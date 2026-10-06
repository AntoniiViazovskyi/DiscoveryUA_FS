import type { Feedback } from '@/types/feedback'

export type ReviewCreatedDetail = {
  feedback: Feedback
  locationId: string
  rate: number
  feedbacksCount: number
}

const REVIEW_CREATED_EVENT = 'relaxmap:review-created'

export function publishReviewCreated(detail: ReviewCreatedDetail) {
  window.dispatchEvent(
    new CustomEvent<ReviewCreatedDetail>(REVIEW_CREATED_EVENT, { detail }),
  )
}

export function subscribeToReviewCreated(
  listener: (detail: ReviewCreatedDetail) => void,
) {
  const handleReviewCreated = (event: Event) => {
    listener((event as CustomEvent<ReviewCreatedDetail>).detail)
  }

  window.addEventListener(REVIEW_CREATED_EVENT, handleReviewCreated)
  return () => window.removeEventListener(REVIEW_CREATED_EVENT, handleReviewCreated)
}