"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import EditProfileModal from "@/components/EditProfileModal/EditProfileModal";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import Logo from "@/components/Logo/Logo";
import { fetchCurrentUser, logout } from "@/lib/api/clientApi";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const isAuthenticated = Boolean(currentUser);
  const user = {
    id: currentUser?._id ?? "",
    name: currentUser?.name?.trim() || currentUser?.username || "",
    avatarUrl: currentUser?.avatarUrl ?? null,
  };

  const closeMenu = () => setIsOpen(false);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  const requestLogout = () => {
    closeMenu();
    setIsLogoutModalOpen(true);
  };
  const closeLogoutModal = useCallback(() => {
    if (!isLoggingOut) setIsLogoutModalOpen(false);
  }, [isLoggingOut]);
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    closeMenu();
    try {
      await logout();
      await queryClient.cancelQueries();
      queryClient.clear();
      setIsLogoutModalOpen(false);
      setIsEditModalOpen(false);
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Не вдалося вийти. Спробуйте ще раз.", {
        toasterId: "profile-edit",
      });
    } finally {
      setIsLoggingOut(false);
    }
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
      <div className={`container ${styles.container}`}>
        <div onClick={closeMenu}>
          <Logo className={styles.logo} />
        </div>

        <Navigation
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={requestLogout}
          isLoggingOut={isLoggingOut}
          onEditProfile={handleEditProfile}
        />
      </div>

      <MobileMenu
        isOpen={isOpen}
        closeMenu={closeMenu}
        isAuthenticated={isAuthenticated}
        user={user}
        onEditProfile={handleEditProfile}
        onLogout={requestLogout}
        isLoggingOut={isLoggingOut}
      />

      {isLogoutModalOpen && isAuthenticated && (
        <ConfirmationModal
          onClose={closeLogoutModal}
          onConfirm={handleLogout}
          isSubmitting={isLoggingOut}
        />
      )}

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
