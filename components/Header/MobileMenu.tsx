"use client";

import Link from "next/link";
import styles from "./Header.module.css";

type Props = {
  isOpen: boolean;
  closeMenu: () => void;
  isAuthenticated: boolean;
  userId: string;
  onLogout: () => void;
};

export default function MobileMenu({
  isOpen,
  closeMenu,
  isAuthenticated,
  userId,
  onLogout,
}: Props) {
  return (
    <nav
      className={`${styles.mobileNav} ${isOpen ? styles.isOpen : ""}`}
      aria-label="Мобільна навігація"
    >
      <Link href="/" onClick={closeMenu}>
        Головна
      </Link>
      <Link href="/locations" onClick={closeMenu}>
        Місця відпочинку
      </Link>

      {isAuthenticated ? (
        <>
          <Link href={`/profile/${userId}`} onClick={closeMenu}>
            Мій профіль
          </Link>
          <Link
            href="/locations/add"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={closeMenu}
          >
            Поділитись локацією
          </Link>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={onLogout}
          >
            Вийти
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={closeMenu}
          >
            Вхід
          </Link>
          <Link
            href="/register"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={closeMenu}
          >
            Реєстрація
          </Link>
        </>
      )}
    </nav>
  );
}
