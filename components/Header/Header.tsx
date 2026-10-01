"use client";

import Link from "next/link";
import { useState } from "react";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

//  замінити на реальну авторизацію, коли вона буде готова
const MOCK_AUTH = false;
const MOCK_USER = { id: "1", name: "Ім'я", avatarUrl: null as string | null };

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = MOCK_AUTH; // TODO: взяти зі стору/хука
  const user = MOCK_USER; // TODO: взяти зі стору/хука

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    closeMenu();
    // TODO: відкрити ConfirmationModal
    console.log("logout clicked");
  };

  return (
    <header className={`${styles.header} ${isOpen ? styles.menuOpen : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="На головну">
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-map-search" />
          </svg>
          <span className={styles.logoText}>Relax Map</span>
        </Link>

        <Navigation
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      <MobileMenu
        isOpen={isOpen}
        closeMenu={closeMenu}
        isAuthenticated={isAuthenticated}
        userId={user.id}
        onLogout={handleLogout}
      />
    </header>
  );
}
