'use client'

import { useEffect, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type { ComponentType, ReactNode } from 'react'

import CommentCard from '@/components/CommentCard/CommentCard'
import type { CommentCardProps } from '@/components/CommentCard/CommentCard'
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

async function fetchLocations(signal: AbortSignal): Promise<Location[]> {
  const firstPage = await fetchJson(
    `/api/locations?page=1&limit=${PAGE_SIZE}&sortBy=name&sortOrder=asc`,
    signal,
  )
  const locations = getArrayProperty(firstPage, 'locations') as Location[]
  const totalPages = getTotalPages(firstPage)

  if (totalPages <= 1) return locations

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchJson(
        `/api/locations?page=${index + 2}&limit=${PAGE_SIZE}&sortBy=name&sortOrder=asc`,
        signal,
      ),
    ),
  )

  return locations.concat(
    ...remainingPages.map((page) => getArrayProperty(page, 'locations') as Location[]),
  )
}

function normalizeFeedbacks(
  data: unknown,
  location: Location | undefined,
  fallbackLocationId: string,
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
      locationId: location?._id ?? fallbackLocationId,
      locationName: location?.name ?? '',
    }]
  })
}

async function fetchLocationFeedbacks(
  locationId: string,
  signal: AbortSignal,
  location?: Location,
): Promise<Feedback[]> {
  const firstPage = await fetchJson(
    `/api/feedbacks?locationId=${encodeURIComponent(locationId)}&page=1&limit=${PAGE_SIZE}`,
    signal,
  )
  const feedbacks = normalizeFeedbacks(firstPage, location, locationId)
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
    ...remainingPages.map((page) => normalizeFeedbacks(page, location, locationId)),
  )
}

function getObjectIdTimestamp(id: string) {
  const timestamp = Number.parseInt(id.slice(0, 8), 16)
  return /^[\da-f]{24}$/i.test(id) && Number.isFinite(timestamp) ? timestamp : 0
}

async function fetchAllReviews(
  signal: AbortSignal,
  locationId?: string,
): Promise<Feedback[]> {
  if (locationId) {
    const feedbacks = await fetchLocationFeedbacks(locationId, signal)
    return feedbacks.sort((first, second) => {
      const timestampDifference =
        getObjectIdTimestamp(second._id) - getObjectIdTimestamp(first._id)
      return timestampDifference || second._id.localeCompare(first._id)
    })
  }

  const locations = (await fetchLocations(signal)).filter(
    (location) =>
      Array.isArray(location.feedbacksId) && location.feedbacksId.length > 0,
  )
  const feedbacksByLocation = await Promise.all(
    locations.map((location) =>
      fetchLocationFeedbacks(location._id, signal, location),
    ),
  )

  return feedbacksByLocation
    .flat()
    .sort((first, second) => {
      const timestampDifference =
        getObjectIdTimestamp(second._id) - getObjectIdTimestamp(first._id)
      return timestampDifference || second._id.localeCompare(first._id)
    })
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
        setReviews(await fetchAllReviews(controller.signal, locationId))
      } catch {
        if (!controller.signal.aborted) setHasError(true)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadReviews()

    return () => controller.abort()
  }, [initialReviews, locationId])

  const hasHeading = Boolean(title || action)

  return (
    <section
      className={styles.section}
      aria-labelledby={title ? 'reviews-title' : undefined}
      aria-label={title ? undefined : 'Відгуки'}
    >
      <div className={styles.container}>
        {hasHeading && (
          <div className={styles.heading}>
            {title && (
              <h2 className={styles.title} id="reviews-title">
                {title}
              </h2>
            )}
            {action}
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
                    locationName={review.locationName}
                    locationHref={`/locations/${review.locationId}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.controls}>
              <div className={styles.navigation}>
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