"use client";
import { useEffect } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ onClose, children, className }: ModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  if (typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`${css.modal} ${className ?? ""}`}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Закрити модальне вікно"
        >
          <svg className={css.icon} width="24" height="24">
            <use href="/icons/sprite.svg#icon-close"></use>
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
