import Link from 'next/link';

import buttonStyles from '@/components/Button/Button.module.css';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Сторінку не знайдено</h1>
      <p className={styles.text}>
        Можливо, її видалили або адреса введена неправильно.
      </p>
      <Link href="/" className={buttonStyles.btn}>
        На головну
      </Link>
    </div>
  );
}