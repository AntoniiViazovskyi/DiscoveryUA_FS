"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

type Props = {
  isOpen: boolean;
  closeMenu: () => void;
  isAuthenticated: boolean;
  user: { id: string; name: string; avatarUrl: string | null };
  onEditProfile: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
};

export default function MobileMenu({
  isOpen,
  closeMenu,
  isAuthenticated,
  user,
  onEditProfile,
  onLogout,
  isLoggingOut,
}: Props) {
  return (
    <nav
      className={`${styles.mobileNav} ${isOpen ? styles.isOpen : ""}`}
      aria-label="Мобільна навігація"
      id="mobile-menu"
    >
      <div className={`container ${styles.menuContainer}`}>
        <div className={styles.menuLinks}>
          <Link href="/" onClick={closeMenu}>
            Головна
          </Link>
          <Link href="/locations" onClick={closeMenu}>
            Місця відпочинку
          </Link>
          {isAuthenticated && (
            <Link href={`/profile/${user.id}`} onClick={closeMenu}>
              Мій профіль
            </Link>
          )}
        </div>
        <div className={styles.menuActions}>
          {isAuthenticated ? (
            <>
              <Link
                href="/locations/add"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={closeMenu}
              >
                Опублікувати статтю
              </Link>
              <div className={`${styles.userInfo} ${styles.menuProfile}`}>
                <button
                  type="button"
                  className={styles.userButton}
                  onClick={onEditProfile}
                  aria-label="Редагувати профіль"
                >
                  <Image
                    src={user.avatarUrl || "https://ac.goit.global/fullstack/react/default-avatar.jpg"}
                    alt=""
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
        </div>
      </div>
    </nav>
  );
}
