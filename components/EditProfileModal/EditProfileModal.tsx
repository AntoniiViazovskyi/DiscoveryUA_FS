'use client';

import { useState, ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Modal from '@/components/Modal/Modal';
import { updateCurrentUser, uploadUserImage } from '@/lib/api/clientApi';
import css from './EditProfileModal.module.css';

const DEFAULT_AVATAR =
  'https://ac.goit.global/fullstack/react/default-avatar.jpg';

const nameSchema = Yup.string()
  .min(3, '\u0406\u043C\u0027\u044F \u043C\u0430\u044E \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 3 \u0441\u0438\u043C\u0432\u043E\u043B\u0438')
  .max(32, '\u0406\u043C\u0027\u044F \u0437\u0430\u043D\u0430\u0434\u0442\u043E \u0434\u043E\u0432\u0433\u0435')
  .required('\u0406\u043C\u0027\u044F \u043E\u0431\u043E\u0432\u0027\u044F\u0437\u043A\u043E\u0432\u0435');

const validationSchema = Yup.object().shape({
  name: nameSchema,
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
    initialValues: {
      name: user.name,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let avatarUrl: string | undefined;

        if (avatarFile) {
          avatarUrl = await uploadUserImage(avatarFile);
        }

        await updateCurrentUser({
          username: values.name,
          name: values.name,
          avatarUrl,
        });

        queryClient.invalidateQueries({ queryKey: ['me'] });

        toast.success('\u041F\u0440\u043E\u0444\u0456\u043B\u044C \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043E');
        onSuccess?.();
        onClose();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : '\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043D\u043E\u0432\u0438\u0442\u0438 \u043F\u0440\u043E\u0444\u0456\u043B\u044C',
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('\u0414\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0456 \u0442\u0456\u043B\u044C\u043A\u0438 JPG, PNG \u0442\u0430 WebP');
      return;
    }

    if (file.size >= 2 * 1024 * 1024) {
      toast.error('\u0420\u043E\u0437\u043C\u0456\u0440 \u0444\u043E\u0442\u043E \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043C\u0435\u043D\u0448\u0435 2 \u041C\u0411');
      return;
    }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <Modal onClose={onClose}>
      <div className={css.container}>
        <h2 className={css.title}>\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u043F\u0440\u043E\u0444\u0456\u043B\u044C</h2>

        <form onSubmit={formik.handleSubmit} className={css.form} aria-label='\u0424\u043E\u0440\u043C\u0430 \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0440\u043E\u0444\u0456\u043B\u044E'>
          <div className={css.avatarSection}>
            <span className={css.label}>\u0410\u0432\u0430\u0442\u0430\u0440</span>

            <div className={css.avatarRow}>
              <div className={css.avatarPreview}>
                <Image
                  className={css.avatarImage}
                  src={previewUrl}
                  alt='\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434 \u0430\u0432\u0430\u0442\u0430\u0440\u0430'
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
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={formik.isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className={css.field}>
            <label className={css.label} htmlFor='edit-profile-name'>
              \u0406\u043C\u0027\u044F
            </label>
            <input
              className={css.input}
              id='edit-profile-name'
              type='text'
              name='name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              maxLength={32}
              placeholder='\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043D\u043E\u0432\u0435 \u0456\u043C\u0027\u044F'
              disabled={formik.isSubmitting}
            />
            {formik.touched.name && formik.errors.name && (
              <span className={css.error}>{formik.errors.name}</span>
            )}
          </div>

          <div className={css.buttons}>
            <button
              type='button'
              className={css.cancelButton}
              onClick={onClose}
              disabled={formik.isSubmitting}
            >
              \u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438
            </button>
            <button
              type='submit'
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? '\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F...' : '\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}