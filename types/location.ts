export type Location = {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  advantages: string[];
  coordinates: {
    lat: number;
    lon: number;
  };
  ownerId: string;
  feedbacksId: string[];
};

export type LocationsHttpResponse = {
  page: number;
  limit: number;
  totalLocations: number;
  totalPages: number;
  locations: Location[];
};