'use client'

import { useRouter } from 'next/navigation'

import LocationCard from '@/components/LocationCard/LocationCard'
import type { Location } from '@/types/location'

import styles from './ProfileLocationsGrid.module.css'

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
    <ul className={styles.grid} aria-label="Список локацій">
      {locations.map((location) => (
        <li key={location._id}>
          <LocationCard
            location={location}
            rating={location.rate}
            onView={(loc) => router.push(`/locations/${loc._id}`)}
            onEdit={
              isOwner
                ? (loc) => router.push(`/locations/${loc._id}/edit`)
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  )
}
