'use client';

import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "@/components/Modal/Modal";
import { updateCurrentUser, uploadUserImage } from "@/lib/api/clientApi";
import css from "./EditProfileModal.module.css";

const DEFAULT_AVATAR =
  "https://ac.goit.global/fullstack/react/default-avatar.jpg";

const TOAST_OPTIONS = { toasterId: "profile-edit" };

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Ім'я має містити щонайменше 3 символи")
    .max(32, "Ім'я має містити не більше 32 символів")
    .required("Введіть ім'я"),
});

type EditProfileModalProps = {
  user: {
    name: string;
    avatarUrl: string | null;
  };
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditProfileModal({
  user,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    user.avatarUrl ?? DEFAULT_AVATAR,
  );
  const formik = useFormik({
    initialValues: { name: user.name },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const name = values.name.trim();
        const avatarUrl = avatarFile
          ? await uploadUserImage(avatarFile)
          : undefined;

        await updateCurrentUser({ username: name, name, avatarUrl });
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        onSuccess?.();
        toast.success("Профіль оновлено", TOAST_OPTIONS);
        onClose();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Не вдалося оновити профіль",
          TOAST_OPTIONS,
        );
      }
    },
  });
  const isSubmitting = formik.isSubmitting;

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
      toast.error("Дозволені тільки JPG та PNG", TOAST_OPTIONS);
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Розмір фото не повинен перевищувати 1 МБ", TOAST_OPTIONS);
      event.target.value = "";
      return;
    }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <Modal onClose={onClose}>
      <div className={css.container}>
        <h2 className={css.title}>Редагувати профіль</h2>

        <form
          className={css.form}
          onSubmit={formik.handleSubmit}
          aria-label="Форма редагування профілю"
        >
          <div className={css.avatarSection}>
            <span className={css.label}>Аватар</span>

            <div className={css.avatarRow}>
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
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor="edit-profile-name">
              Ім&apos;я
            </label>
            <input
              className={css.input}
              id="edit-profile-name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(formik.touched.name && formik.errors.name)}
              aria-describedby={
                formik.touched.name && formik.errors.name
                  ? "edit-profile-name-error"
                  : undefined
              }
              maxLength={32}
              placeholder="Введіть нове ім'я"
              disabled={isSubmitting}
            />
            {formik.touched.name && formik.errors.name && (
              <p className={css.error} id="edit-profile-name-error" role="alert">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div className={css.buttons}>
            <button
              className={css.cancelButton}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Відмінити
            </button>

            <button
              className={css.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
