import Link from "next/link";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`${styles.logo} ${className}`.trim()}>
      <svg className={styles.icon}>
        <use href="/icons/sprite.svg#icon-map-search" />
      </svg>
      <span>Relax Map</span>
    </Link>
  );
};

export default Logo;
