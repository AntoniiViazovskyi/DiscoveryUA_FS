'use client';

import { useState } from 'react';
import Image from 'next/image';

import type { PublicUser } from '@/types/user';

import styles from './ProfileInfo.module.css';

type ProfileInfoProps = {
  user: PublicUser;
  locationsAmount?: number;
};

export const ProfileInfo = ({ user, locationsAmount }: ProfileInfoProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  const displayName = user.name ?? user.username;
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
        <h2 className={styles.name}>{displayName}</h2>
        <p className={styles.count}>Статей: {locationCount}</p>
      </div>
    </div>
  );
};