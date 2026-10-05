import { Oval } from 'react-loader-spinner';

import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.wrapper}>
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