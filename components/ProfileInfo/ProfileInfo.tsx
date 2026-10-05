'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import EditProfileModal from '@/components/EditProfileModal/EditProfileModal';

import type { PublicUser } from '@/types/user';

import styles from './ProfileInfo.module.css';

type ProfileInfoProps = {
  user: PublicUser;
  locationsAmount?: number;
  isOwner?: boolean;
};

export const ProfileInfo = ({ user, locationsAmount, isOwner = false }: ProfileInfoProps) => {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const displayName = user.name?.trim() || user.username;
  const locationCount = locationsAmount ?? user.articlesAmount ?? 0;
  const initial = displayName.charAt(0).toUpperCase();
  const showAvatar = Boolean(user.avatarUrl) && !imageFailed;

  return (
    <div className={styles.wrapper}>
      {showAvatar ? (
        <Image
          src={user.avatarUrl!}
          alt={displayName}
          width={145}
          height={145}
          className={styles.avatar}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={styles.avatarFallback} aria-hidden="true">
          {initial}
        </div>
      )}

      <div className={styles.details}>
        <h1 className={styles.name}>{displayName}</h1>
        <p className={styles.count}>Статей: {locationCount}</p>
      </div>

      {isOwner && (
        <button
          type="button"
          className={styles.editButton}
          onClick={() => setIsEditOpen(true)}
        >
          Редагувати профіль
        </button>
      )}

      {isEditOpen && (
        <EditProfileModal
          user={{
            name: user.name?.trim() || user.username,
            avatarUrl: user.avatarUrl ?? null,
          }}
          onClose={() => setIsEditOpen(false)}
          onSuccess={router.refresh}
        />
      )}
    </div>
  );
};