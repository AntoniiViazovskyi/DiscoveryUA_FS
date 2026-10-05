import { redirect } from 'next/navigation'

import LocationForm from '@/components/LocationForm/LocationForm'
import { getCurrentUser, ProfileApiUnavailableError } from '@/lib/api/profile'
import css from './page.module.css'

export default async function CreateLocationPage() {
  let currentUser

  try {
    currentUser = await getCurrentUser()
  } catch (err) {
    if (err instanceof ProfileApiUnavailableError) {
      return (
        <main className={`container ${css.page}`}>
          <h1 className={css.heading}>Додавання нового місця</h1>
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
    <main className={`container ${css.page}`}>
      <h1 className={css.heading}>Додавання нового місця</h1>
      <LocationForm />
    </main>
  )
}
