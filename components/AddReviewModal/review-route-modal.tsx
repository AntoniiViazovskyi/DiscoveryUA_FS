'use client'

import { useRouter } from 'next/navigation'

import AuthPromptModal from '@/components/AuthPromptModal/AuthPromptModal'
import { AddReviewSubmission } from '@/components/AddReviewModal/add-review-submission'

type ReviewRouteModalProps = {
  locationId: string
  isAuthenticated: boolean
}

export default function ReviewRouteModal({
  locationId,
  isAuthenticated,
}: ReviewRouteModalProps) {
  const router = useRouter()
  const onClose = () => router.back()

  if (!isAuthenticated) return <AuthPromptModal onClose={onClose} />

  return <AddReviewSubmission locationId={locationId} onClose={onClose} />
}