'use client'

import { useEffect, useRef } from 'react'

import Modal from '@/components/Modal/Modal'
import { AddReviewForm } from '@/components/AddReviewForm/add-review-form'
import type { AddReviewFormValues } from '@/components/AddReviewForm/add-review-form-schema'

import styles from './add-review-modal.module.css'

type AddReviewModalProps = {
  onClose: () => void
  onSubmit: (values: AddReviewFormValues) => Promise<void> | void
}

export function AddReviewModal({ onClose, onSubmit }: AddReviewModalProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    titleRef.current?.focus()

    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  }, [])

  return (
    <Modal onClose={onClose}>
      <h2 className={styles.title} ref={titleRef} tabIndex={-1}>
        Залишити відгук
      </h2>
      <AddReviewForm onCancel={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
