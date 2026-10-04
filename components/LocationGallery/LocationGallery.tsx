import Image from "next/image";
import styles from "./LocationGallery.module.css";

type LocationGalleryProps = {
  image: string;
  name: string;
};

export default function LocationGallery({ image, name }: LocationGalleryProps) {
  return (
    <div className={styles.gallery}>
      <Image
        src={image}
        alt={name}
        width={755}
        height={503}
        className={styles.image}
        sizes="(min-width: 1440px) 755px, (min-width: 768px) 704px, calc(100vw - 40px)"
      />
    </div>
  );
}
