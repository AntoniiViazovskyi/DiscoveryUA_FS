'use client';

import { useEffect } from 'react';

import Button from '@/components/Button/Button';

import styles from './error.module.css';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Щось пішло не так</h1>
      <p className={styles.text}>
        Спробуйте ще раз або поверніться пізніше.
      </p>
      <Button type="button" onClick={reset}>
        Спробувати ще
      </Button>
    </div>
  );
}