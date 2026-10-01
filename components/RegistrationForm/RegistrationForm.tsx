'use client'

import { useId } from 'react'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

import { register } from '@/lib/api/clientApi'

import {
  registrationFormSchema,
  type RegistrationFormValues,
} from './registration-form-schema'
import styles from './RegistrationForm.module.css'

const INITIAL_VALUES: RegistrationFormValues = {
  username: '',
  email: '',
  password: '',
}

export default function RegistrationForm() {
  const router = useRouter()
  const formId = useId()

  const handleSubmit = async (values: RegistrationFormValues) => {
    try {
      await register({
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })

      toast.success('Реєстрація успішна.')
      router.push('/profile')
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Не вдалося зареєструватися. Спробуйте ще раз.',
      )
    }
  }

  return (
    <>
      <Formik<RegistrationFormValues>
        initialValues={INITIAL_VALUES}
        validationSchema={registrationFormSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting, touched }) => (
          <Form className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-username`}>
                Імʼя*
              </label>
              <Field
                className={styles.input}
                id={`${formId}-username`}
                name="username"
                type="text"
                placeholder="Ваше імʼя"
                autoComplete="name"
                aria-describedby={`${formId}-username-error`}
                aria-invalid={Boolean(touched.username && errors.username)}
              />
              <p
                className={styles.error}
                id={`${formId}-username-error`}
                aria-live="polite"
              >
                {touched.username ? errors.username : ''}
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-email`}>
                Пошта*
              </label>
              <Field
                className={styles.input}
                id={`${formId}-email`}
                name="email"
                type="email"
                placeholder="hello@relaxmap.ua"
                autoComplete="email"
                inputMode="email"
                aria-describedby={`${formId}-email-error`}
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              <p
                className={styles.error}
                id={`${formId}-email-error`}
                aria-live="polite"
              >
                {touched.email ? errors.email : ''}
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-password`}>
                Пароль*
              </label>
              <Field
                className={styles.input}
                id={`${formId}-password`}
                name="password"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                aria-describedby={`${formId}-password-error`}
                aria-invalid={Boolean(touched.password && errors.password)}
              />
              <p
                className={styles.error}
                id={`${formId}-password-error`}
                aria-live="polite"
              >
                {touched.password ? errors.password : ''}
              </p>
            </div>

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Реєструємо…' : 'Зареєструватись'}
            </button>
          </Form>
        )}
      </Formik>

      <Toaster position="top-right" />
    </>
  )
}
