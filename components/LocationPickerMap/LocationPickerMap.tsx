"use client";

import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import toast from "react-hot-toast";

import css from "./LocationPickerMap.module.css";

export type LocationCoordinates = {
  lat: number;
  lon: number;
};

type LocationPickerMapProps = {
  value: LocationCoordinates | null;
  onLocationSelect: (coordinates: LocationCoordinates) => void;
  hasError?: boolean;
};

type NominatimPlace = {
  lat: string;
  lon: string;
};

const DEFAULT_CENTER: [number, number] = [50.4501, 30.5234];
const DEFAULT_ZOOM = 10;
const SELECTED_ZOOM = 13;

function normalizeCoordinates(
  coordinates: LocationCoordinates | null,
): [number, number] | null {
  if (
    !coordinates ||
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lon)
  ) {
    return null;
  }

  return [coordinates.lat, coordinates.lon];
}

function ChangeMapView({
  coordinates,
}: {
  coordinates: LocationCoordinates | null;
}) {
  const map = useMap();

  useEffect(() => {
    const position = normalizeCoordinates(coordinates);

    if (position) {
      map.setView(position, SELECTED_ZOOM);
    }
  }, [coordinates, map]);

  return null;
}

function SelectLocationOnClick({
  onLocationSelect,
}: {
  onLocationSelect: (coordinates: LocationCoordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        lat: event.latlng.lat,
        lon: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function LocationPickerMap({
  value,
  onLocationSelect,
  hasError = false,
}: LocationPickerMapProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: css.markerIcon,
        html: `<span class="${css.markerPin}"></span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      }),
    [],
  );

  const markerPosition = normalizeCoordinates(value);
  const trimmedSearchValue = searchValue.trim();

  const handleMapLocationSelect = (coordinates: LocationCoordinates) => {
    setSearchValue("");
    onLocationSelect(coordinates);
  };

  const handleSearch = async () => {
    if (!trimmedSearchValue) {
      toast.error("Введіть назву місця для пошуку");
      return;
    }

    setIsSearching(true);

    try {
      const params = new URLSearchParams({
        format: "json",
        limit: "1",
        q: trimmedSearchValue,
        "accept-language": "uk",
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const places = (await response.json()) as NominatimPlace[];
      const place = places[0];

      if (!place) {
        toast.error("Місце не знайдено");
        return;
      }

      onLocationSelect({
        lat: Number(place.lat),
        lon: Number(place.lon),
      });
    } catch {
      toast.error("Не вдалося знайти місце на карті");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={css.wrapper}>
      <div className={css.searchForm}>
        <input
          className={`${css.searchInput} ${hasError ? css.searchInputError : ""}`}
          type="text"
          aria-label="Пошук місця на карті"
          value={searchValue}
          placeholder="Обери свою локацію"
          onChange={(event) => setSearchValue(event.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button
          className={css.searchButton}
          type="button"
          disabled={isSearching || !trimmedSearchValue}
          onClick={handleSearch}
        >
          {isSearching ? "Пошук..." : "Пошук"}
        </button>
      </div>

      <div className={`${css.mapWrap} ${hasError ? css.mapWrapError : ""}`}>
        <MapContainer
          className={css.map}
          center={markerPosition ?? DEFAULT_CENTER}
          zoom={markerPosition ? SELECTED_ZOOM : DEFAULT_ZOOM}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView coordinates={value} />
          <SelectLocationOnClick onLocationSelect={handleMapLocationSelect} />
          {markerPosition && (
            <Marker position={markerPosition} icon={markerIcon} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
