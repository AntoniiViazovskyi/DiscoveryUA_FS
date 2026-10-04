'use client'

import { useRouter } from 'next/navigation'

import LocationsGrid from '@/components/LocationsGrid/LocationsGrid'
import type { Location } from '@/types/location'

import styles from './ProfileLocationsGrid.module.css'

const STAR_COUNT = 5

function getStarIcon(rating: number, index: number) {
  const fullStars = Math.floor(rating)

  if (index < fullStars) {
    return 'icon-star-filled'
  }

  if (index === fullStars && rating - fullStars >= 0.5) {
    return 'icon-star-half'
  }

  return 'icon-star-rate'
}

function renderRating(location: Location) {
  const rating = Math.min(5, Math.max(0, Math.round((location.rate ?? 0) * 2) / 2))

  return (
    <div
      className={styles.rating}
      role="img"
      aria-label={`Рейтинг ${rating} з 5`}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <svg
          className={styles.star}
          key={index}
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <use href={`/icons/sprite.svg#${getStarIcon(rating, index)}`} />
        </svg>
      ))}
    </div>
  )
}

type ProfileLocationsGridProps = {
  locations: Location[]
  isOwner: boolean
}

export default function ProfileLocationsGrid({
  locations,
  isOwner,
}: ProfileLocationsGridProps) {
  const router = useRouter()

  return (
    <LocationsGrid
      locations={locations}
      renderRating={renderRating}
      onView={(location) => router.push(`/locations/${location._id}`)}
      onEdit={
        isOwner
          ? (location) => router.push(`/locations/${location._id}/edit`)
          : undefined
      }
    />
  )
}