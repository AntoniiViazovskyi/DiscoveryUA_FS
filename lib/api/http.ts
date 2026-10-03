import axios from 'axios'

export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export type FetchLocationsParams = {
  page?: number;
  limit?: number;
  region?: string;
  type?: string;
  search?: string;
  rate?: string;
  sortBy?: string;
  sortOrder?: string;
};