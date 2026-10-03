import "server-only";

import { cookies } from "next/headers";

import { api } from "@/app/api/api";
import type { LocationDetails, LocationsHttpResponse } from "@/types/location";
import { FetchLocationsParams } from "./http";

export async function fetchAllLocations({
  page = 1,
  limit = 10,
  region,
  type,
  search,
  rate,
  sortBy = "rate",
  sortOrder = "desc",
}: FetchLocationsParams): Promise<LocationsHttpResponse> {
  const cookieStore = await cookies();
  const response = await api.get<LocationsHttpResponse>("/locations", {
    params: {
      page,
      limit,
      region,
      type,
      search,
      rate,
      sortBy,
      sortOrder,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function fetchLocationById(
  locationId: string,
): Promise<LocationDetails> {
  const cookieStore = await cookies();
  const response = await api.get<LocationDetails>(`/locations/${locationId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}
