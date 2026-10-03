import Link from 'next/link'

import styles from './AuthNav.module.css'

type AuthPage = 'register' | 'login'

type AuthNavProps = {
  active: AuthPage
}

const AUTH_LINKS: ReadonlyArray<{
  href: string
  label: string
  page: AuthPage
}> = [
  { href: '/register', label: 'Реєстрація', page: 'register' },
  { href: '/login', label: 'Вхід', page: 'login' },
]

export default function AuthNav({ active }: AuthNavProps) {
  return (
    <nav className={styles.nav} aria-label="Навігація авторизації">
      {AUTH_LINKS.map(({ href, label, page }) => {
        const isActive = active === page

        return (
          <Link
            className={`${styles.link} ${isActive ? styles.active : ''}`}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            key={page}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
