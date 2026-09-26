'use client'

import type { FormEventHandler } from 'react'

import styles from './add-review-form.module.css'

type AddReviewFormProps = {
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function AddReviewForm({ onCancel, onSubmit }: AddReviewFormProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <fieldset className={styles.ratingGroup}>
        <legend className={styles.label}>Ваша оцінка</legend>

        <div className={styles.ratingPlaceholder} aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span className={styles.star} key={index}>
              ☆
            </span>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-description">
          Ваш відгук
        </label>
        <textarea
          className={styles.textarea}
          id="review-description"
          name="description"
          maxLength={200}
          rows={6}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.cancelButton} type="button" onClick={onCancel}>
          Відмінити
        </button>
        <button className={styles.submitButton} type="submit">
          Надіслати
        </button>
      </div>
    </form>
  )
}
