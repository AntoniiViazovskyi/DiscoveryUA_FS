export type Location = {
  _id: string;
  name: string;
  rate: number;
  region: string;
};

export type LocationsHttpResponse = {
  page: number;
  limit: number;
  totalLocations: number;
  totalPages: number;
  locations: Location[];
};