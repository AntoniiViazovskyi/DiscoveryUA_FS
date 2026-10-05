'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import AuthPromptModal from '@/components/AuthPromptModal/AuthPromptModal'
import { AddReviewSubmission } from './add-review-submission'
import { locationHref, takeReviewOrigin } from './review-navigation'
import { ReviewNotifications } from './review-notifications'

type AddReviewEntryProps = {
  locationId: string
  isAuthenticated: boolean
  intercepted?: boolean
}

export function AddReviewEntry({
  locationId,
  isAuthenticated,
  intercepted = false,
}: AddReviewEntryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [closed, setClosed] = useState(false)
  const closing = useRef(false)
  const reviewHref = `${locationHref(locationId)}/review`

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    closing.current = false
    setClosed(false)
  }, [pathname])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    setClosed(true)
    const hasOrigin = takeReviewOrigin(locationId)
    if (intercepted && hasOrigin) router.back()
    else router.replace(locationHref(locationId), { scroll: false })
  }, [intercepted, locationId, router])

  // Next can retain an unmatched parallel slot during soft navigation.
  const visible = mounted && !closed && pathname === reviewHref

  return (
    <>
      {visible &&
        (isAuthenticated ? (
          <AddReviewSubmission locationId={locationId} onClose={close} />
        ) : (
          <AuthPromptModal onClose={close} />
        ))}
      {!intercepted && <ReviewNotifications />}
    </>
  )
}
