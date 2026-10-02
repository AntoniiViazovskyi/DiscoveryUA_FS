import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ProfileInfo } from '@/components/ProfileInfo/ProfileInfo'
import { ProfilePlaceholder } from '@/components/ProfilePlaceholder/ProfilePlaceholder'
import ProfileLocationsGrid from '@/components/ProfileLocationsGrid/ProfileLocationsGrid'
import {
  getCurrentUser,
  getPublicUser,
  getUserLocations,
  ProfileApiUnavailableError,
} from '@/lib/api/profile'
import { SITE_NAME } from '@/lib/seo'

import styles from './profile-page.module.css'

type Props = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const user = await getPublicUser(userId).catch(() => null)
  const displayName = user?.name ?? user?.username ?? 'Профіль'

  return {
    title: displayName,
    description: `Профіль користувача ${displayName} на ${SITE_NAME}.`,
    alternates: {
      canonical: `/profile/${userId}`,
    },
  }
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { userId } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  let profileUser
  let locationsData
  let currentUser = null

  try {
    // Fetch current user silently — null if not logged in
    ;[currentUser, profileUser, locationsData] = await Promise.all([
      getCurrentUser().catch(() => null),
      getPublicUser(userId),
      getUserLocations(userId, page),
    ])
  } catch (err) {
    if (err instanceof ProfileApiUnavailableError) {
      return (
        <main className="container">
          <div className={styles.page}>
            <div className={styles.notice}>
              <p>Не вдалося завантажити профіль. Спробуйте пізніше.</p>
            </div>
          </div>
        </main>
      )
    }
    throw err
  }

  if (!profileUser) {
    notFound()
  }

  const isOwner = currentUser?._id === userId
  const displayName = profileUser.name ?? profileUser.username
  const locations = locationsData?.data ?? []
  const totalPages = locationsData?.totalPages ?? 1
  const hasLocations = locations.length > 0

  return (
    <main className="container">
      <div className={styles.page}>
        <h1 className={styles.heading}>
          {isOwner ? 'Мій профіль' : `Профіль ${displayName}`}
        </h1>

        <ProfileInfo
          user={profileUser}
          locationsAmount={locationsData?.total ?? locations.length}
        />

        <section className={styles.section} aria-labelledby="locations-title">
          <h2 className={styles.sectionTitle} id="locations-title">
            {isOwner ? 'Мої локації' : 'Локації користувача'}
          </h2>

          {hasLocations ? (
            <>
              <ProfileLocationsGrid locations={locations} isOwner={isOwner} />

              {totalPages > 1 && (
                <nav className={styles.pagination} aria-label="Сторінки локацій">
                  {page > 1 && (
                    <Link
                      href={`/profile/${userId}?page=${page - 1}`}
                      className={styles.pageLink}
                      aria-label="Попередня сторінка"
                    >
                      ←
                    </Link>
                  )}
                  <span className={styles.pageInfo}>
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/profile/${userId}?page=${page + 1}`}
                      className={styles.pageLink}
                      aria-label="Наступна сторінка"
                    >
                      →
                    </Link>
                  )}
                </nav>
              )}
            </>
          ) : (
            <ProfilePlaceholder isOwner={isOwner} />
          )}
        </section>
      </div>
    </main>
  )
}
