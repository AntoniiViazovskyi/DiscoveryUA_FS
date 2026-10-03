import Link from 'next/link';

import styles from './ProfilePlaceholder.module.css';

type ProfilePlaceholderProps = {
  isOwner: boolean;
};

export const ProfilePlaceholder = ({ isOwner }: ProfilePlaceholderProps) => {
  const text = isOwner
    ? 'Ви ще нічого не публікували, поділіться своєю першою локацією!'
    : 'Цей користувач ще не ділився локаціями';

  const linkText = isOwner ? 'Поділитись локацією' : 'Назад до локацій';
  const href = isOwner ? '/locations/add' : '/locations';

  return (
    <div className={styles.card}>
      <p className={styles.text}>{text}</p>
      <Link href={href} className={styles.button}>
        {linkText}
      </Link>
    </div>
  );
};