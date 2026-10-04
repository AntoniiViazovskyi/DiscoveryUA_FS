"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import EditProfileModal from "@/components/EditProfileModal/EditProfileModal";
import { fetchCurrentUser } from "@/lib/api/clientApi";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const isAuthenticated = Boolean(currentUser);
  const user = {
    id: currentUser?._id ?? "",
    name: currentUser?.username ?? "",
    avatarUrl: currentUser?.avatarUrl ?? null,
  };

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    closeMenu();
    console.log("logout clicked");
  };
  const handleEditProfile = () => {
    closeMenu();
    setIsEditModalOpen(true);
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
          onEditProfile={handleEditProfile}
        />
      </div>

      <MobileMenu
        isOpen={isOpen}
        closeMenu={closeMenu}
        isAuthenticated={isAuthenticated}
        userId={user.id}
        onLogout={handleLogout}
      />

      {isEditModalOpen && isAuthenticated && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </header>
  );
}
