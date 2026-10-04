"use client";

import dynamic from "next/dynamic";

import css from "./LocationMap.module.css";

const LocationMapInner = dynamic(() => import("./LocationMapInner"), {
  ssr: false,
  loading: () => (
    <div className={css.map} role="status" aria-label="Завантаження карти" />
  ),
});

type LocationMapProps = {
  coordinates?: { lat: number; lon: number } | null;
  name: string;
};

export default function LocationMap({ coordinates, name }: LocationMapProps) {
  if (
    !coordinates ||
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lon)
  ) {
    return <p className={css.missing}>Координати відсутні</p>;
  }

  return <LocationMapInner coordinates={coordinates} name={name} />;
}
