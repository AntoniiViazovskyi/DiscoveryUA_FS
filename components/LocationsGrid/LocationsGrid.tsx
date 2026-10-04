'use client'

import type { ReactNode } from 'react'
import LocationCard from '@/components/LocationCard/LocationCard'
import type { Location } from '@/types/location'
import css from './LocationsGrid.module.css'

export type LocationsGridProps<TLocation extends Location = Location> = {
  locations: TLocation[]
  onView: (location: TLocation) => void
  onEdit?: (location: TLocation) => void
  renderRating?: (location: TLocation) => ReactNode
  getLocationTypeLabel?: (location: TLocation) => string | undefined
}

export default function LocationsGrid<TLocation extends Location>({
  locations,
  onView,
  onEdit,
  renderRating,
  getLocationTypeLabel,
}: LocationsGridProps<TLocation>) {
  return (
    <div className={css.grid}>
      {locations.map((location) => (
        <LocationCard
          key={location._id}
          location={location}
          locationTypeLabel={getLocationTypeLabel?.(location)}
          rating={renderRating?.(location)}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
