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

import styles from "./page.module.css";

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
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={null}>
          <FilterPanel />
          <LocationsCatalog />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}