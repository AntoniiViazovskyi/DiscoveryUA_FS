'use client'

import { useEffect, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type { ComponentType, ReactNode } from 'react'

import CommentCard from '@/components/CommentCard/CommentCard'
import type { CommentCardProps } from '@/components/CommentCard/CommentCard'
import { subscribeToReviewCreated } from '@/lib/reviews/review-events'
import type { Feedback } from '@/types/feedback'
import type { Location } from '@/types/location'

import styles from './ReviewsBlock.module.css'

type ReviewsBlockProps = {
  initialReviews?: Feedback[]
  locationId?: string
  title?: string | null
  action?: ReactNode
  CardComponent?: ComponentType<CommentCardProps>
}

type FeedbackApiItem = {
  _id?: string
  id?: string
  rate?: number
  rating?: number
  description?: string
  comment?: string
  authorName?: string
  ownerName?: string
  userName?: string
  author?: { name?: string }
  owner?: { name?: string }
  user?: { name?: string }
  location?: { _id?: string; name?: string; locationType?: string }
}

const PAGE_SIZE = 50

function getArrayProperty(data: unknown, property: string): unknown[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && property in data) {
    const value = data[property as keyof typeof data]
    return Array.isArray(value) ? value : []
  }
  return []
}

function getTotalPages(data: unknown) {
  if (!data || typeof data !== 'object' || !('totalPages' in data)) return 1
  const totalPages = Number(data.totalPages)
  return Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1
}

async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

function normalizeFeedbacks(
  data: unknown,
  location: Location | undefined,
  fallbackLocationId: string,
  locationType?: string,
): Feedback[] {
  const records = getArrayProperty(data, 'data').length
    ? getArrayProperty(data, 'data')
    : getArrayProperty(data, 'feedbacks')

  return records.flatMap((record, index) => {
    if (!record || typeof record !== 'object') return []

    const item = record as FeedbackApiItem
    const rate = item.rate ?? item.rating
    const description = item.description ?? item.comment
    const authorName =
      item.authorName ?? item.ownerName ?? item.userName ?? item.author?.name ?? item.owner?.name ?? item.user?.name

    if (
      typeof rate !== 'number' ||
      typeof description !== 'string' ||
      typeof authorName !== 'string'
    ) {
      return []
    }

    return [{
      _id: item._id ?? item.id ?? `feedback-${index}`,
      rate,
      description,
      authorName,
      locationId: location?._id ?? item.location?._id ?? fallbackLocationId,
      locationName: location?.name ?? item.location?.name ?? '',
      locationType:
        locationType ?? item.location?.locationType ?? location?.locationType,
    }]
  })
}

async function fetchLocationFeedbacks(
  locationId: string,
  signal: AbortSignal,
  location?: Location,
  locationType?: string,
): Promise<Feedback[]> {
  const firstPage = await fetchJson(
    `/api/feedbacks?locationId=${encodeURIComponent(locationId)}&page=1&limit=${PAGE_SIZE}`,
    signal,
  )
  const feedbacks = normalizeFeedbacks(
    firstPage,
    location,
    locationId,
    locationType,
  )
  const totalPages = getTotalPages(firstPage)

  if (totalPages <= 1) return feedbacks

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchJson(
        `/api/feedbacks?locationId=${encodeURIComponent(locationId)}&page=${index + 2}&limit=${PAGE_SIZE}`,
        signal,
      ),
    ),
  )

  return feedbacks.concat(
    ...remainingPages.map((page) =>
      normalizeFeedbacks(page, location, locationId, locationType),
    ),
  )
}

function getObjectIdTimestamp(id: string) {
  const timestamp = Number.parseInt(id.slice(0, 8), 16)
  return /^[\da-f]{24}$/i.test(id) && Number.isFinite(timestamp) ? timestamp : 0
}

function sortReviews(reviews: Feedback[]) {
  return reviews.sort((first, second) => {
    const timestampDifference =
      getObjectIdTimestamp(second._id) - getObjectIdTimestamp(first._id)
    return timestampDifference || second._id.localeCompare(first._id)
  })
}

async function fetchHomeReviews(signal: AbortSignal): Promise<Feedback[]> {
  const response = await fetchJson('/api/feedbacks/latest', signal)
  return normalizeFeedbacks(response, undefined, '')
}

async function fetchReviews(
  signal: AbortSignal,
  locationId?: string,
): Promise<Feedback[]> {
  if (!locationId) return fetchHomeReviews(signal)
  return sortReviews(await fetchLocationFeedbacks(locationId, signal))
}

function ReviewsBlockContent({
  initialReviews,
  locationId,
  title = 'Останні відгуки',
  action,
  CardComponent = CommentCard,
}: ReviewsBlockProps) {
  const [reviews, setReviews] = useState(initialReviews ?? [])
  const [isLoading, setIsLoading] = useState(initialReviews === undefined)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (initialReviews !== undefined) return

    const controller = new AbortController()

    async function loadReviews() {
      try {
        setReviews(await fetchReviews(controller.signal, locationId))
      } catch {
        if (!controller.signal.aborted) setHasError(true)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadReviews()

    return () => controller.abort()
  }, [initialReviews, locationId])

  useEffect(() => {
    return subscribeToReviewCreated(({ feedback, locationId: createdLocationId }) => {
      if (locationId && createdLocationId !== locationId) return

      setReviews((currentReviews) => {
        const nextReviews = [
          feedback,
          ...currentReviews.filter((review) => review._id !== feedback._id),
        ]
        return locationId ? nextReviews : nextReviews.slice(0, 7)
      })
      setHasError(false)
      setIsLoading(false)
    })
  }, [locationId])

  const hasHeading = Boolean(title || action)
  const sectionClassName = locationId
    ? `${styles.section} ${styles.locationSection}`
    : `${styles.section} ${styles.homeSection}`

  return (
    <section
      className={sectionClassName}
      aria-labelledby={title ? 'reviews-title' : undefined}
      aria-label={title ? undefined : 'Відгуки'}
    >
      <div className={locationId ? 'container' : styles.homeContainer}>
        {hasHeading && (
          <div className={styles.heading}>
            {title && (
              <h2 className={styles.title} id="reviews-title">
                {title}
              </h2>
            )}
            {action && <div className={styles.action}>{action}</div>}
          </div>
        )}

        {isLoading ? (
          <p className={styles.message} role="status">Завантажуємо відгуки...</p>
        ) : hasError ? (
          <p className={styles.message} role="status">
            Відгуки тимчасово недоступні.
          </p>
        ) : reviews.length === 0 ? (
          <p className={styles.message} role="status">Відгуків поки немає.</p>
        ) : (
          <div className={styles.slider}>
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={24}
              loop={reviews.length > 3}
              navigation={{
                nextEl: `.${styles.nextButton}`,
                prevEl: `.${styles.prevButton}`,
              }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1440: { slidesPerView: 3 },
              }}
              className={styles.swiper}
            >
              {reviews.map((review) => (
                <SwiperSlide className={styles.slide} key={review._id}>
                  <CardComponent
                    rating={review.rate}
                    comment={review.description}
                    authorName={review.authorName}
                    locationName={review.locationType ?? review.locationName}
                    locationHref={`/locations/${review.locationId}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.controls}>
              <button
                className={styles.prevButton}
                type="button"
                aria-label="Попередній відгук"
              >
                <svg aria-hidden="true" width="24" height="24">
                  <use href="/icons/sprite.svg#icon-arrow-back" />
                </svg>
              </button>
              <button
                className={styles.nextButton}
                type="button"
                aria-label="Наступний відгук"
              >
                <svg aria-hidden="true" width="24" height="24">
                  <use href="/icons/sprite.svg#icon-arrow-forward" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function ReviewsBlock(props: ReviewsBlockProps) {
  const key = props.locationId ?? 'all-locations'
  return <ReviewsBlockContent key={key} {...props} />
}
