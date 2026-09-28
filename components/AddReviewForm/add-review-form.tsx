'use client'

import { useId, useState } from 'react'
import { Field, Form, Formik } from 'formik'

import styles from './add-review-form.module.css'
import {
  addReviewSchema,
  type AddReviewFormValues,
} from './add-review-form-schema'

type AddReviewFormProps = {
  onCancel: () => void
  onSubmit: (values: AddReviewFormValues) => Promise<void> | void
}

type RatingFieldProps = {
  disabled: boolean
  errorId: string
  groupId: string
  value: number
  onBlur: () => void
  onChange: (rate: number) => void
}

const RATING_VALUES = [1, 2, 3, 4, 5]

function RatingField({
  disabled,
  errorId,
  groupId,
  value,
  onBlur,
  onChange,
}: RatingFieldProps) {
  const [previewRate, setPreviewRate] = useState<number | null>(null)
  const activeRate = previewRate ?? value

  return (
    <div className={styles.ratingOptions} onMouseLeave={() => setPreviewRate(null)}>
      {RATING_VALUES.map((rate) => {
        const starClassName =
          rate <= activeRate
            ? `${styles.star} ${styles.starSelected}`
            : styles.star

        return (
          <label
            className={`${styles.ratingOption} ${
              disabled ? styles.ratingOptionDisabled : ''
            }`}
            htmlFor={`${groupId}-${rate}`}
            key={rate}
            onMouseEnter={() => setPreviewRate(rate)}
          >
            <input
              className={styles.ratingInput}
              id={`${groupId}-${rate}`}
              name="rate"
              type="radio"
              value={rate}
              checked={value === rate}
              disabled={disabled}
              aria-describedby={errorId}
              aria-label={`Оцінка ${rate} з 5`}
              onBlur={() => {
                setPreviewRate(null)
                onBlur()
              }}
              onChange={() => onChange(rate)}
              onFocus={() => setPreviewRate(rate)}
            />
            <span className={starClassName} aria-hidden="true">
              ★
            </span>
          </label>
        )
      })}
    </div>
  )
}

export function AddReviewForm({ onCancel, onSubmit }: AddReviewFormProps) {
  const descriptionId = useId()
  const descriptionErrorId = `${descriptionId}-error`
  const ratingGroupId = useId()
  const ratingErrorId = useId()

  return (
    <Formik<AddReviewFormValues>
      initialValues={{ rate: 0, description: '' }}
      validationSchema={addReviewSchema}
      onSubmit={async (values) => {
        await onSubmit({
          ...values,
          description: values.description.trim(),
        })
      }}
    >
      {({
        errors,
        isSubmitting,
        setFieldTouched,
        setFieldValue,
        touched,
        values,
      }) => (
        <Form className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={descriptionId}>
              Ваш відгук
            </label>
            <Field
              as="textarea"
              className={styles.textarea}
              id={descriptionId}
              name="description"
              placeholder="Напишіть ваш відгук"
              rows={6}
              aria-describedby={descriptionErrorId}
              aria-invalid={Boolean(touched.description && errors.description)}
            />
            <p
              className={styles.error}
              id={descriptionErrorId}
              aria-live="polite"
            >
              {touched.description ? errors.description : ''}
            </p>
          </div>

          <fieldset
            className={styles.ratingGroup}
            aria-describedby={ratingErrorId}
            aria-invalid={Boolean(touched.rate && errors.rate)}
          >
            <legend className={styles.label}>Ваша оцінка</legend>

            <RatingField
              disabled={isSubmitting}
              errorId={ratingErrorId}
              groupId={ratingGroupId}
              value={values.rate}
              onBlur={() => void setFieldTouched('rate', true)}
              onChange={(rate) => void setFieldValue('rate', rate)}
            />
            <p className={styles.error} id={ratingErrorId} aria-live="polite">
              {touched.rate ? errors.rate : ''}
            </p>
          </fieldset>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onCancel}
            >
              Відмінити
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              Надіслати
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
