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
};

export default function Navigation({
  isOpen,
  setIsOpen,
  isAuthenticated,
  user,
  onLogout,
}: Props) {
  return (
    <>
      {/* Десктопна навігація */}
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
              Поділитись локацією
            </Link>
            <div className={styles.userInfo}>
              <Image
                src={user.avatarUrl || DEFAULT_AVATAR}
                alt={user.name}
                width={32}
                height={32}
                className={styles.avatar}
                unoptimized
              />
              <span className={styles.userName}>{user.name}</span>
              <button
                type="button"
                className={styles.logoutButton}
                aria-label="Вийти з акаунту"
                onClick={onLogout}
              >
                {/* TODO: підставити реальний id іконки зі sprite.svg */}
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
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </>
  );
}
