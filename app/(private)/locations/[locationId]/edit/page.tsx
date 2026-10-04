import { redirect } from 'next/navigation'

import { getCurrentUser, ProfileApiUnavailableError } from '@/lib/api/profile'

import EditLocationClient from './EditLocationClient'
import css from './page.module.css'

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ locationId: string }>
}) {
  const { locationId } = await params

  let currentUser

  try {
    currentUser = await getCurrentUser()
  } catch (err) {
    if (err instanceof ProfileApiUnavailableError) {
      return (
        <main className="container">
          <h1 className={css.heading}>Редагування місця</h1>
          <p className={css.notice} role="alert">
            Сервіс тимчасово недоступний. Спробуйте пізніше.
          </p>
        </main>
      )
    }
    throw err
  }

  if (!currentUser) {
    redirect('/login')
  }

  return (
    <main className="container">
      <h1 className={css.heading}>Редагування місця</h1>
      <EditLocationClient
        locationId={locationId}
        currentUserId={currentUser._id}
      />
    </main>
  )
}
