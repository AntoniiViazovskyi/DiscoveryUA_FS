import { redirect } from 'next/navigation'

import { getCurrentUser, ProfileApiUnavailableError } from '@/lib/api/profile'

import styles from './profile.module.css'

export default async function MyProfileRedirectPage() {
  let currentUser

  try {
    currentUser = await getCurrentUser()
  } catch (err) {
    if (err instanceof ProfileApiUnavailableError) {
      return (
        <main className="container">
          <div className={styles.page}>
            <div className={styles.notice}>
              <p>Сервіс тимчасово недоступний. Спробуйте пізніше.</p>
            </div>
          </div>
        </main>
      )
    }
    throw err
  }

  if (!currentUser) {
    redirect('/login')
  }

  redirect(`/profile/${currentUser._id}`)
}
