import Link from 'next/link';

import Button from '@/components/Button/Button';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Сторінку не знайдено</h1>
      <p className={styles.text}>
        Можливо, її видалили або адреса введена неправильно.
      </p>
      <Link href="/" className={styles.link}>
        <Button type="button">На головну</Button>
      </Link>
    </div>
  );
}