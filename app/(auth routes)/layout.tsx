import type { ReactNode } from 'react'
import Link from 'next/link'

import styles from './auth-layout.module.css'

type AuthLayoutProps = Readonly<{
  children: ReactNode
}>

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <header className={styles.header}>
          <Link className={styles.logo} href="/" aria-label="Relax Map — головна">
            <svg
              className={styles.logoIcon}
              width="24"
              height="24"
              aria-hidden="true"
            >
              <use href="/icons/sprite.svg#icon-map-search" />
            </svg>
            <span>Relax Map</span>
          </Link>
        </header>

        {children}

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Relax Map
        </footer>
      </div>
    </main>
  )
}
