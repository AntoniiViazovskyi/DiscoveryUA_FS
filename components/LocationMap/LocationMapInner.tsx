"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import css from "./LocationMap.module.css";

type LocationMapInnerProps = {
  coordinates: { lat: number; lon: number };
  name: string;
};

const markerIcon = L.divIcon({
  className: css.markerIcon,
  html: `<span class="${css.markerPin}"></span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function LocationMapInner({
  coordinates,
  name,
}: LocationMapInnerProps) {
  const position: [number, number] = [coordinates.lat, coordinates.lon];

  return (
    <div className={css.map}>
      <MapContainer
        className={css.mapCanvas}
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
