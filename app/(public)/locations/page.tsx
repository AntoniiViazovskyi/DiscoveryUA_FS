import { getAllTypesServer, getAllRegionsServer } from "@/lib/api/filterServer";
import { QueryClient, HydrationBoundary, dehydrate, } from "@tanstack/react-query";
import FilterPanel from "@/components/FilterPanel/FilterPanel";


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
        <div className="container">
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilterPanel />
    </HydrationBoundary>
  </div>
  );
}
