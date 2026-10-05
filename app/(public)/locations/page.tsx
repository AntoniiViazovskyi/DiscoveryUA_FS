import type { Metadata } from "next";
import { Suspense } from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import FilterPanel from "@/components/FilterPanel/FilterPanel";
import LocationsCatalog from "@/components/LocationsCatalog/LocationsCatalog";
import {
  getAllRegionsServer,
  getAllTypesServer,
} from "@/lib/api/filterServer";
import { SITE_URL } from "@/lib/seo";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Усі місця відпочинку",
  description:
    "Переглядайте місця для відпочинку в Україні, знаходьте цікаві локації за регіоном, типом та рейтингом.",
  alternates: {
    canonical: new URL("/locations", SITE_URL),
  },
};

export default async function LocationsPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["locationTypes"],
      queryFn: () => getAllTypesServer(),
      retry: false,
    }),
    queryClient.prefetchQuery({
      queryKey: ["regions"],
      queryFn: () => getAllRegionsServer(),
      retry: false,
    }),
  ]);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Усі місця відпочинку</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={null}>
          <FilterPanel />
          <LocationsCatalog />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}