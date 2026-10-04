"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topContent}>
          <Logo className={styles.logoMargin} />

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
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Природні Мандри. Усі права захищені.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
