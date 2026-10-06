'use client'

import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { AddReviewModal } from './add-review-modal'
import { REVIEW_TOASTER_ID } from './review-notifications'
import type { AddReviewFormValues } from '@/components/AddReviewForm/add-review-form-schema'
import { publishReviewCreated } from '@/lib/reviews/review-events'
import type { Feedback } from '@/types/feedback'

type AddReviewSubmissionProps = {
  locationId: string
  locationName: string
  onClose: () => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function AddReviewSubmission({
  locationId,
  locationName,
  onClose,
}: AddReviewSubmissionProps) {
  const pending = useRef<Promise<void> | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const close = useCallback(() => {
    mounted.current = false
    onClose()
  }, [onClose])

  function submit(values: AddReviewFormValues) {
    if (pending.current) return pending.current
    const request = Promise.resolve().then(() => send(values))
    pending.current = request
    return request
  }

  async function send(values: AddReviewFormValues) {
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ ...values, locationId }),
      })
      const result: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const message =
          response.status === 401
            ? 'Увійдіть у свій акаунт, щоб надіслати відгук.'
            : response.status === 404
              ? 'Цю локацію не знайдено.'
              : response.status === 422
                ? 'Перевірте ім’я у своєму профілі.'
                : 'Не вдалося надіслати відгук. Спробуйте ще раз.'
        throw new Error(message)
      }
      const payload = isRecord(result) ? result : null
      const feedbackData =
        payload && isRecord(payload.data) ? payload.data : null
      const locationData =
        payload && isRecord(payload.location) ? payload.location : null
      const userData =
        feedbackData && isRecord(feedbackData.user) ? feedbackData.user : null
      const feedbackLocation =
        feedbackData && isRecord(feedbackData.location)
          ? feedbackData.location
          : null
      const authorName = [
        feedbackData?.authorName,
        feedbackData?.userName,
        feedbackData?.ownerName,
        userData?.name,
      ].find((value): value is string => typeof value === 'string')
      const feedbackId = feedbackData?._id
      const rate = feedbackData?.rate
      const description = feedbackData?.description
      const locationRate = locationData?.rate
      const feedbacksCount = locationData?.feedbacksCount

      if (
        response.status !== 201 ||
        typeof feedbackId !== 'string' ||
        !/^[a-f\d]{24}$/i.test(feedbackId) ||
        typeof rate !== 'number' ||
        typeof description !== 'string' ||
        typeof authorName !== 'string' ||
        typeof locationRate !== 'number' ||
        typeof feedbacksCount !== 'number'
      ) {
        throw new Error('Не вдалося підтвердити збереження відгуку.')
      }

      const feedback: Feedback = {
        _id: feedbackId,
        rate,
        description,
        authorName,
        locationId,
        locationName:
          typeof feedbackLocation?.name === 'string'
            ? feedbackLocation.name
            : locationName,
      }

      publishReviewCreated({
        feedback,
        locationId,
        rate: locationRate,
        feedbacksCount,
      })
      toast.success('Ваш відгук додано.', {
        toasterId: REVIEW_TOASTER_ID,
      })
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'TimeoutError'
          ? 'Сервер не відповів вчасно. Спробуйте ще раз.'
          : error instanceof TypeError
            ? 'Не вдалося надіслати відгук. Перевірте з’єднання.'
            : error instanceof Error
              ? error.message
              : 'Не вдалося надіслати відгук. Спробуйте ще раз.'
      toast.error(message, { toasterId: REVIEW_TOASTER_ID })
      throw new Error(message)
    } finally {
      pending.current = null
    }
  }

  return (
    <AddReviewModal
      onClose={close}
      onSubmit={submit}
      onSuccess={() => {
        if (mounted.current) close()
      }}
    />
  )
}
