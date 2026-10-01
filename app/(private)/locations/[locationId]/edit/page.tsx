'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Oval } from 'react-loader-spinner'

import LocationForm from '@/components/LocationForm/LocationForm'
import { fetchLocationById } from '@/lib/api/clientApi'
import type { Location } from '@/types/location'
import css from './page.module.css'

export default function EditLocationPage() {
  const { locationId } = useParams<{ locationId: string }>()

  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

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

  return (
    <main className="container">
      <h1 className={css.heading}>Редагування місця</h1>

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

      {!loading && !error && location && (
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
    </main>
  )
}
