'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import css from './LocationCard.module.css'

type LocationCardData = {
  _id: string
  name: string
  image?: string
  locationType?: string
}

export type LocationCardProps<TLocation extends LocationCardData = LocationCardData> = {
  location: TLocation
  rating?: ReactNode
  onView: (location: TLocation) => void
  onEdit?: (location: TLocation) => void
}

export default function LocationCard<TLocation extends LocationCardData>({
  location,
  rating,
  onView,
  onEdit,
}: LocationCardProps<TLocation>) {
  return (
    <article className={css.card}>
      <div className={css.imageFrame}>
        {location.image ? (
          <Image
            className={css.image}
            src={location.image}
            alt={location.name}
            fill
            unoptimized
          />
        ) : (
          <span className={css.imagePlaceholder} aria-hidden="true">
            Фото відсутнє
          </span>
        )}
      </div>

      <div className={css.content}>
        {location.locationType && (
          <p className={css.type}>{location.locationType}</p>
        )}
        {rating && <div className={css.rating}>{rating}</div>}
        <h3 className={css.name}>{location.name}</h3>

        <div className={css.actions}>
          <button
            className={css.viewButton}
            type="button"
            onClick={() => onView(location)}
          >
            Переглянути локацію
          </button>
          {onEdit && (
            <button
              className={css.editButton}
              type="button"
              aria-label={`Редагувати локацію ${location.name}`}
              title="Редагувати локацію"
              onClick={() => onEdit(location)}
            >
              <svg className={css.editIcon} aria-hidden="true" focusable="false">
                <use href="/icons/sprite.svg#icon-edit" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}