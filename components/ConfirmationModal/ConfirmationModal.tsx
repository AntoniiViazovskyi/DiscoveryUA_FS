"use client";

import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import css from "./ConfirmationModal.module.css";

type ConfirmationModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export default function ConfirmationModal({
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmationModalProps) {
  return (
    <Modal onClose={onClose} className={css.modal}>
      <div className={css.content} aria-busy={isSubmitting}>
        <div className={css.text}>
          <h2 className={css.title}>Ви точно хочете вийти?</h2>
          <p className={css.description}>Ми будемо сумувати за вами!</p>
        </div>
        <div className={css.actions}>
          <Button
            type="button"
            className={`${css.button} ${css.cancel}`}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Відмінити
          </Button>
          <Button
            type="button"
            className={css.button}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            Вийти
          </Button>
        </div>
      </div>
    </Modal>
  );
}
