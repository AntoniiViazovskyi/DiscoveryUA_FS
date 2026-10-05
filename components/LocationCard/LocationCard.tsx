"use client";

import Image from "next/image";
import Button from "@/components/Button/Button";
import { useState, type ReactNode } from "react";
import css from "./LocationCard.module.css";

type LocationCardData = {
  _id: string;
  name: string;
  image?: string;
  locationType?: string;
};

export type LocationCardProps<
  TLocation extends LocationCardData = LocationCardData,
> = {
  location: TLocation;
  locationTypeLabel?: string;
  rating?: ReactNode;
  onView: (location: TLocation) => void;
  onEdit?: (location: TLocation) => void;
};

export default function LocationCard<TLocation extends LocationCardData>({
  location,
  locationTypeLabel,
  rating,
  onView,
  onEdit,
}: LocationCardProps<TLocation>) {
  const typeLabel = locationTypeLabel?.trim() || location.locationType?.trim();

  const [failedImage, setFailedImage] = useState<string | null>(null);

  const imageSrc =
    location.image && failedImage !== location.image ? location.image : null;

  return (
    <article className={css.card}>
      <div className={css.imageFrame}>
        {imageSrc ? (
          <Image
            className={css.image}
            src={imageSrc}
            alt={location.name}
            fill
            unoptimized
            onError={() => setFailedImage(imageSrc)}
          />
        ) : (
          <Image
            className={css.image}
            src="/images/location-placeholder.png"
            alt=""
            fill
            aria-hidden="true"
          />
        )}
      </div>

      <div className={css.content}>
        {typeLabel && <p className={css.type}>{typeLabel}</p>}
        {rating && <div className={css.rating}>{rating}</div>}
        <h3 className={css.name}>{location.name}</h3>

        <div className={css.actions}>
          <Button
            className={css.viewButton}
            type="button"
            onClick={() => onView(location)}
          >
            Переглянути локацію
          </Button>
          {onEdit && (
            <Button
              className={css.editButton}
              type="button"
              aria-label={`Редагувати локацію ${location.name}`}
              title="Редагувати локацію"
              onClick={() => onEdit(location)}
            >
              <svg
                className={css.editIcon}
                aria-hidden="true"
                focusable="false"
              >
                <use href="/icons/sprite.svg#icon-edit" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
