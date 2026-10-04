"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./LocationGallery.module.css";

type LocationGalleryProps = {
  image?: string | null;
  name: string;
};

export default function LocationGallery({ image, name }: LocationGalleryProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageSrc = image && failedImage !== image ? image : null;

  return (
    <div className={styles.gallery}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name}
          width={755}
          height={503}
          className={styles.image}
          sizes="(min-width: 1440px) 755px, (min-width: 768px) 704px, calc(100vw - 40px)"
          onError={() => setFailedImage(imageSrc)}
        />
      ) : (
        <Image
          src="/images/location-placeholder.png"
          alt=""
          width={755}
          height={503}
          aria-hidden="true"
          className={styles.image}
        />
      )}
    </div>
  );
}
