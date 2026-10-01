import type { Metadata } from 'next'

import AuthNav from '@/components/AuthNav/AuthNav'
import RegistrationForm from '@/components/RegistrationForm/RegistrationForm'

import styles from './register-page.module.css'

export const metadata: Metadata = {
  title: 'Реєстрація',
  description: 'Створіть обліковий запис Relax Map.',
  alternates: {
    canonical: '/register',
  },
}

export default function RegisterPage() {
  return (
    <section className={styles.content} aria-labelledby="register-title">
      <div className={styles.authPanel}>
        <AuthNav active="register" />

        <div className={styles.formPane}>
          <h1 className={styles.title} id="register-title">
            Реєстрація
          </h1>
          <RegistrationForm />
        </div>
      </div>
    </section>
  )
}
