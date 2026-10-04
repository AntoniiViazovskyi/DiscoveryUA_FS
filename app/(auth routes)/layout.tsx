import type { ReactNode } from 'react'
import Logo from '@/components/Logo/Logo'

import styles from './auth-layout.module.css'

type AuthLayoutProps = Readonly<{
  children: ReactNode
}>

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <header className={styles.header}>
          <Logo className={styles.logo} />
        </header>

        {children}

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Relax Map
        </footer>
      </div>
    </main>
  )
}
