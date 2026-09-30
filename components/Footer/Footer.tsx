import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg className={styles.logoIcon}>
            <use href="/icons/sprite.svg#icon-map-search" />
          </svg>
          <span>Relax Map</span>
        </Link>
      </div>
      <div className={styles.socials}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Facebook"
        >
          <svg className={styles.socialIcon}>
            <use href="/icons/sprite.svg#icon-facebook" />
          </svg>
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Instagram"
        >
          <svg className={styles.socialIcon}>
            <use href="/icons/sprite.svg#icon-instagram" />
          </svg>
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="X (Twitter)"
        >
          <svg className={styles.socialIcon}>
            <use href="/icons/sprite.svg#icon-x" />
          </svg>
        </a>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="YouTube"
        >
          <svg className={styles.socialIcon}>
            <use href="/icons/sprite.svg#icon-youtube" />
          </svg>
        </a>
      </div>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Головна
        </Link>
        <Link href="/locations" className={styles.navLink}>
          Місця відпочинку
        </Link>
      </nav>

      <div className={styles.copyright}>
        © 2025 Природні Мандри. Усі права захищені.
      </div>
    </footer>
  );
};

export default Footer;
