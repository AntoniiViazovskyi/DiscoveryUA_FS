"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "@/components/Modal/Modal";
import { updateCurrentUser, uploadUserImage } from "@/lib/api/clientApi";
import css from "./EditProfileModal.module.css";

const DEFAULT_AVATAR =
  "https://ac.goit.global/fullstack/react/default-avatar.jpg";

type EditProfileModalProps = {
  user: {
    name: string;
    avatarUrl: string | null;
  };
  onClose: () => void;
};

export default function EditProfileModal({
  user,
  onClose,
}: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    user.avatarUrl ?? DEFAULT_AVATAR,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Дозволені тільки JPG та PNG");
      return;
    }

    if (file.size >= 1024 * 1024) {
      toast.error("Розмір фото має бути менше 1 МБ");
      return;
    }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName && !avatarFile) {
      toast.error("Введіть ім'я або завантажте фото");
      return;
    }

    if (trimmedName && trimmedName.length < 3) {
      toast.error("Ім'я має містити щонайменше 3 символи");
      return;
    }

    try {
      setIsSubmitting(true);

      const body: { username?: string; avatarUrl?: string } = {};

      if (trimmedName) {
        body.username = trimmedName;
      }

      if (avatarFile) {
        body.avatarUrl = await uploadUserImage(avatarFile);
      }

      await updateCurrentUser(body);
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Профіль оновлено");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не вдалося оновити профіль",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className={css.container}>
        <h2 className={css.title}>Редагувати профіль</h2>

        <form
          className={css.form}
          onSubmit={handleSubmit}
          aria-label="Форма редагування профілю"
        >
          <div className={css.avatarSection}>
            <span className={css.label}>Аватар</span>

            <div className={css.avatarPreview}>
              <Image
                className={css.avatarImage}
                src={previewUrl}
                alt="Попередній перегляд аватара"
                width={120}
                height={120}
                unoptimized
              />
            </div>

            <label className={css.fileButton}>
              Завантажити фото
              <input
                className={css.fileInput}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
                disabled={isSubmitting}
              />
            </label>
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="edit-profile-name">
              Ім&apos;я
            </label>
            <input
              className={css.input}
              id="edit-profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={32}
              placeholder="Введіть ім'я"
              disabled={isSubmitting}
            />
          </div>

          <div className={css.buttons}>
            <button
              className={css.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Зберігаємо..." : "Зберегти"}
            </button>

            <button
              className={css.cancelButton}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
