"use client";

import Link from "next/link";

import Modal from "@/components/Modal/Modal";

import css from "./AuthPromptModal.module.css";

interface AuthPromptModalProps {
  onClose: () => void;
}

export default function AuthPromptModal({ onClose }: AuthPromptModalProps) {
  return (
    <Modal onClose={onClose} className={css.authModal}>
      <div className={css.content}>
        <h2 className={css.title}>Помилка під час додавання відгуку</h2>

        <p className={css.description}>
          Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису
          зареєструйтесь
        </p>

        <div className={css.actions}>
          <Link href="/login" className={css.loginLink}>
            Увійти
          </Link>

          <Link href="/register" className={css.registerLink}>
            Зареєструватись
          </Link>
        </div>
      </div>
    </Modal>
  );
}
