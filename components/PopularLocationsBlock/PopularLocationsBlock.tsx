"use client";

import SwiperSlider from "../SwiperSlider/SwiperSlider";
import css from "./PopularLocationsBlock.module.css";
import Link from "next/link";
import LocationCard from "../LocationCard/LocationCard";
import { fetchAllLocations } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getAllTypes, getAllRegions } from "@/lib/api/filterClient";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function PopularLocationsBlock() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["popular-locations"],
    queryFn: () =>
      fetchAllLocations({
        page: 1,
        limit: 6,
        sortBy: "rate",
        sortOrder: "desc",
      }),
  });

  const { data: types = [], isLoading: isTypesLoading } = useQuery({
    queryKey: ["location-types"],
    queryFn: getAllTypes,
  });

  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: getAllRegions,
  });
  const isLoadingData = isLoading || isTypesLoading || isRegionsLoading;
  const locations = data?.locations ?? [];

  if (isError) {
    return (
      <section className={css.popularLocationSection}>
        <div className="container">
          <ErrorMessage message="Не вдалося завантажити локації" />
        </div>
      </section>
    );
  }

  return (
    <section className={css.popularLocationSection}>
      <div className="container">
        <div className={css.popularLocationContainer}>
          <h2 className={css.popularLocationsTitle}>Популярні локації</h2>

          <Link href="/locations" className={css.popularLocationsLink}>
            Всі локації
          </Link>
        </div>
        {isLoadingData ? (
          <Loader />
        ) : (
          <SwiperSlider
            items={locations}
            getKey={(location) => location._id}
            navigationMarginTop={40}
            renderItem={(location) => {
              const region = regions.find(
                (item) => item.slug === location.region,
              );

              const locationType = types.find(
                (item) => item.slug === location.locationType,
              );

              return (
                <LocationCard
                  location={{
                    ...location,
                    region: region?.region ?? location.region,
                    locationType: locationType?.type ?? location.locationType,
                  }}
                  rating={
                    <div className={css.rating}>
                      {Array.from({ length: 5 }, (_, index) => {
                        let icon = "icon-star-rate";

                        const rate = location.rate ?? 0;
                        const fullStars = Math.floor(rate);
                        const hasHalfStar = rate % 1 !== 0;

                        if (index < fullStars) {
                          icon = "icon-star-filled";
                        } else if (index === fullStars && hasHalfStar) {
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
                  }
                  onView={(location) => {
                    router.push(`/locations/${location._id}`);
                  }}
                />
              );
            }}
          />
        )}
      </div>
    </section>
  );
}
