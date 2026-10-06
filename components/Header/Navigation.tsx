"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const DEFAULT_AVATAR =
  "https://ac.goit.global/fullstack/react/default-avatar.jpg";

type User = { id: string; name: string; avatarUrl: string | null };

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  isAuthenticated: boolean;
  user: User;
  onLogout: () => void;
  isLoggingOut: boolean;
  onEditProfile: () => void;
};

export default function Navigation({
  isOpen,
  setIsOpen,
  isAuthenticated,
  user,
  onLogout,
  isLoggingOut,
  onEditProfile,
}: Props) {
  return (
    <>
      <nav className={styles.nav} aria-label="Основна навігація">
        <Link href="/" className={styles.navLink}>
          Головна
        </Link>
        <Link href="/locations" className={styles.navLink}>
          Місця відпочинку
        </Link>
        {isAuthenticated && (
          <Link href={`/profile/${user.id}`} className={styles.navLink}>
            Мій профіль
          </Link>
        )}
      </nav>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <Link
              href="/locations/add"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.addLink}`}
            >
              Опублікувати статтю
            </Link>
            <div className={styles.userInfo}>
              <button
                type="button"
                className={styles.userButton}
                onClick={onEditProfile}
                aria-label="Редагувати профіль"
              >
                <Image
                  src={user.avatarUrl || DEFAULT_AVATAR}
                  alt={user.name}
                  width={32}
                  height={32}
                  className={styles.avatar}
                  unoptimized
                />
                <span className={styles.userName}>{user.name}</span>
              </button>
              <button
                type="button"
                className={styles.logoutButton}
                aria-label="Вийти з акаунту"
                onClick={onLogout}
                disabled={isLoggingOut}
              >
                <svg width="24" height="24" aria-hidden="true">
                  <use href="/icons/sprite.svg#icon-logout" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className={`${styles.btn} ${styles.btnGhost}`}>
              Вхід
            </Link>
            <Link
              href="/register"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Реєстрація
            </Link>
          </>
        )}

        <button
          type="button"
          className={styles.burger}
          aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href={`/icons/sprite.svg#${isOpen ? "icon-close" : "icon-menu"}`} />
          </svg>
        </button>
      </div>
    </>
  );
}
