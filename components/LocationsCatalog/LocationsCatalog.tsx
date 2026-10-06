"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/Button/Button";
import buttonCss from "@/components/Button/Button.module.css";
import LocationsGrid from "@/components/LocationsGrid/LocationsGrid";
import { getAllTypes } from "@/lib/api/filterClient";
import { fetchAllLocations } from "@/lib/api/clientApi";
import type { Location, LocationsHttpResponse } from "@/types/location";
import css from "./LocationsCatalog.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

type CatalogState = {
  filterKey: string;
  pages: LocationsHttpResponse[];
  totalPages: number;
};

export default function LocationsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<CatalogState | null>(null);
  const [requestedPage, setRequestedPage] = useState(1);
  const [scrollTarget, setScrollTarget] = useState<{
    filterKey: string;
    index: number;
  } | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1440px)");
    const updatePageSize = () => setPageSize(mediaQuery.matches ? 9 : 6);
    updatePageSize();
    mediaQuery.addEventListener("change", updatePageSize);
    return () => mediaQuery.removeEventListener("change", updatePageSize);
  }, []);

  const search = searchParams.get("search") ?? "";
  const region = searchParams.get("region") ?? "";
  const type = searchParams.get("type") ?? "";
  const rate = searchParams.get("rate") ?? "";
  const sortBy = searchParams.get("sortBy") || "rate";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const filterKey = JSON.stringify({
    pageSize,
    search,
    region,
    type,
    rate,
    sortBy,
    sortOrder,
  });
  const currentCatalog = catalog?.filterKey === filterKey ? catalog : null;
  const currentPage = currentCatalog?.pages.at(-1)?.page ?? 0;
  const pageToFetch = currentCatalog ? requestedPage : 1;

  const locationsQuery = useQuery({
    queryKey: [
      "locations",
      {
        page: pageToFetch,
        limit: pageSize ?? 6,
        search,
        region,
        type,
        rate,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: () =>
      fetchAllLocations({
        page: pageToFetch,
        limit: pageSize ?? 6,
        search: search || undefined,
        region: region || undefined,
        type: type || undefined,
        rate: rate || undefined,
        sortBy,
        sortOrder,
      }),
    enabled: pageSize !== null,
  });
  const { data: types = [], isLoading: isTypesLoading,
  isError: isTypesError,
  refetch: refetchTypes, } = useQuery({
    queryKey: ["locationTypes"],
    queryFn: getAllTypes,
  });

  useEffect(() => {
    const response = locationsQuery.data;
    if (!response) return;

    const currentPages = catalog?.filterKey === filterKey ? catalog.pages : [];
    const loadedPage = currentPages.at(-1)?.page ?? 0;
    if (response.page <= loadedPage) return;
    const loadedLocationsCount = currentPages.reduce(
      (count, page) => count + page.locations.length,
      0,
    );

    setCatalog((current) => {
      if (current?.filterKey !== filterKey) {
        return {
          filterKey,
          pages: [response],
          totalPages: response.totalPages,
        };
      }

      const lastPage = current.pages.at(-1)?.page ?? 0;
      if (response.page <= lastPage) return current;

      return {
        ...current,
        pages: [...current.pages, response],
        totalPages: response.totalPages,
      };
    });

    if (response.page === 1) {
      setRequestedPage(1);
      setScrollTarget(null);
    } else {
      setScrollTarget({ filterKey, index: loadedLocationsCount });
    }
  }, [catalog, filterKey, locationsQuery.data]);

  useEffect(() => {
    if (!scrollTarget) return;
    if (scrollTarget.filterKey !== filterKey) {
      setScrollTarget(null);
      return;
    }

    resultsRef.current
      ?.querySelectorAll("article")
      .item(scrollTarget.index)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setScrollTarget(null);
  }, [currentCatalog?.pages.length, filterKey, scrollTarget]);

  const pages = currentCatalog?.pages ?? [];
  const locations = pages.flatMap((page) => page.locations);
  const totalPages = currentCatalog?.totalPages ?? 0;
  const showBackToTop = pageSize !== null && locations.length > pageSize;
  const isInitialLoading =
  !currentCatalog && (pageSize === null || locationsQuery.isLoading || isTypesLoading);
  const isInitialError = !currentCatalog && (locationsQuery.isError || isTypesError);
  const isLoadingNextPage =
    Boolean(currentCatalog) &&
    currentPage > 0 &&
    pageToFetch > currentPage &&
    locationsQuery.isFetching;
  const isNextPageError =
    Boolean(currentCatalog) &&
    pageToFetch > currentPage &&
    locationsQuery.isError;

  if (!currentCatalog) {
    if (isInitialError) {
      return (
        <div className={css.state}>
          <ErrorMessage message="Не вдалося завантажити локації. Спробуйте ще раз." />
          <div className={css.buttonWrap}>
            <Button
              className={`${buttonCss.btn} ${css.actionButton}`}
              type="button"
              onClick={() => {void locationsQuery.refetch(); void refetchTypes();
              }
              }
            >
              Спробувати ще раз
            </Button>
          </div>
        </div>
      );
    }
  if (isInitialLoading) {
    return (
      <div className={css.state} role="status">
        <Loader />
      </div>
    );
  }
}

  if (locations.length === 0) {
    return (
      <p className={css.empty}>За вибраними фільтрами місць не знайдено.</p>
    );
  }

  return (
    <section aria-label="Місця відпочинку" ref={resultsRef}>
      <div className={css.results}>
        <LocationsGrid
          locations={locations}
          onView={(location) => router.push(`/locations/${location._id}`)}
          getLocationTypeLabel={(location: Location) =>
            types.find((item) => item.slug === location.locationType)?.type ??
            location.locationType
          }
          renderRating={(location) => {
            const rating = location.rate ?? 0;
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;

            return (
              <div
                className={css.rating}
                role="img"
                aria-label={`Оцінка: ${rating.toFixed(1)} з 5`}
              >
                {Array.from({ length: 5 }, (_, index) => {
                  let icon = "icon-star-rate";
                  if (index < fullStars) icon = "icon-star-filled";
                  else if (index === fullStars && hasHalfStar) {
                    icon = "icon-star-half";
                  }

                  return (
                    <svg
                      key={index}
                      className={css.star}
                      width={24}
                      height={24}
                      aria-hidden="true"
                    >
                      <use href={`/icons/sprite.svg#${icon}`} />
                    </svg>
                  );
                })}
              </div>
            );
          }}
        />
      </div>

      {isLoadingNextPage && (
        <div className={css.state} role="status">
          <Loader />
        </div>
      )}
      {isNextPageError && (
        <ErrorMessage />
      )}

      {(currentPage < totalPages || showBackToTop) && (
        <div className={`${css.buttonWrap} ${showBackToTop ? css.buttonWrapWithTop : ""}`}>
          {currentPage < totalPages && (
          <Button
            className={`${buttonCss.btn} ${css.actionButton}`}
            type="button"
            disabled={locationsQuery.isFetching}
            onClick={() => {
              if (isNextPageError) {
                void locationsQuery.refetch();
                return;
              }
              setRequestedPage(currentPage + 1);
            }}
          >
            {isLoadingNextPage
              ? "Завантаження..."
              : isNextPageError
                ? "Спробувати ще раз"
                : "Показати ще"}
          </Button>
          )}
          {showBackToTop && (
            <Button
              className={css.backToTop}
              type="button"
              aria-label="Повернутися нагору"
              onClick={() => window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto" : "smooth",
              })}
            >
              <svg className={css.arrowUp} aria-hidden="true" focusable="false">
                <use href="/icons/sprite.svg#icon-keyboard-arrow-up" />
              </svg>
              <span className={css.backToTopLabel}>Нагору</span>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
