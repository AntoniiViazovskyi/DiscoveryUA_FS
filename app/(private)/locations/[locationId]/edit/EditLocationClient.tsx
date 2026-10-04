'use client'

import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'

import LocationForm from '@/components/LocationForm/LocationForm'
import { fetchLocationById } from '@/lib/api/clientApi'
import type { LocationDetails } from '@/types/location'
import css from './page.module.css'

type EditLocationClientProps = {
  locationId: string
  currentUserId: string
}

export default function EditLocationClient({
  locationId,
  currentUserId,
}: EditLocationClientProps) {
  const [location, setLocation] = useState<LocationDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)
    setLocation(null)

    const loadLocation = async () => {
      try {
        const data = await fetchLocationById(locationId)

        if (!cancelled) setLocation(data)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Не вдалося завантажити локацію',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadLocation()

    return () => {
      cancelled = true
    }
  }, [locationId])

  const isOwner = Boolean(location?.ownerId?._id === currentUserId)

  return (
    <>
      {loading && (
        <div className={css.state} role="status" aria-label="Завантаження">
          <Oval
            height={60}
            width={60}
            color="#cc6534"
            visible
            ariaLabel="oval-loading"
            secondaryColor="rgba(204, 101, 52, 0.4)"
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>
      )}

      {!loading && error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && location && !isOwner && (
        <p className={css.notice} role="alert">
          Ви можете редагувати тільки власні локації
        </p>
      )}

      {!loading && !error && location && isOwner && (
        <LocationForm
          mode="edit"
          locationId={locationId}
          initialImage={location.image}
          initialValues={{
            name: location.name,
            type: location.locationType,
            region: location.region,
            description: location.description,
          }}
        />
      )}
    </>
  )
}
