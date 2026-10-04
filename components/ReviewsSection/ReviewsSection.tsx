'use client'

import ReviewCard from '@/components/ReviewCard/ReviewCard'
import ReviewsBlock from '@/components/ReviewsBlock/ReviewsBlock'

import styles from './ReviewsSection.module.css'

type ReviewsSectionProps = {
  locationId: string
  onLeaveReview: () => void
}

export default function ReviewsSection({
  locationId,
  onLeaveReview,
}: ReviewsSectionProps) {
  return (
    <ReviewsBlock
      locationId={locationId}
      title="Відгуки"
      CardComponent={ReviewCard}
      action={(
        <button
          className={styles.leaveReviewButton}
          type="button"
          onClick={onLeaveReview}
        >
          Залишити відгук
        </button>
      )}
    />
  )
}