import { Oval } from 'react-loader-spinner';

import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <Oval
        visible
        height={48}
        width={48}
        color="var(--color-accent)"
        secondaryColor="var(--color-surface-accent)"
        strokeWidth={4}
        ariaLabel="loading"
      />
    </div>
  );
}