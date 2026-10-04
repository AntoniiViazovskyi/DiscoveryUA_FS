'use client'

import { Toaster } from 'react-hot-toast'

export const REVIEW_TOASTER_ID = 'reviews'

export function ReviewNotifications() {
  return <Toaster toasterId={REVIEW_TOASTER_ID} position="top-right" />
}
