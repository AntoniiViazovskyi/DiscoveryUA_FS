"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

const MOCK_AUTH = false;
const MOCK_USER = { id: "1", name: "Ім'я", avatarUrl: null as string | null };

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = MOCK_AUTH; 
  const user = MOCK_USER;

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    closeMenu();
    console.log("logout clicked");
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1440px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
