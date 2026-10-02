import Image from 'next/image';

import type { PublicUser } from '@/types/user';

import styles from './ProfileInfo.module.css';

type ProfileInfoProps = {
  user: PublicUser;
  locationsAmount?: number;
};

export const ProfileInfo = ({ user, locationsAmount }: ProfileInfoProps) => {
  const displayName = user.name ?? user.username;
  const locationCount = locationsAmount ?? user.articlesAmount ?? 0;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.wrapper}>
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={displayName}
          width={145}
          height={145}
          className={styles.avatar}
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