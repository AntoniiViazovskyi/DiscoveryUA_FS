import { LocationsHttpResponse } from '@/types/location';
import { http } from './http';



export async function fetchLocations(
  page: number = 1,
  limit: number = 10,
  region?: string,
  type?: string,
  search?: string,
  rate?: number,
  sortBy: 'rate' | 'name' = 'rate',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<LocationsHttpResponse> {
  const response = await http.get<LocationsHttpResponse>('/locations', {
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
  });

  return response.data;
}