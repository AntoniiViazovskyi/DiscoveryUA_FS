import { isAxiosError } from "axios";

import {
  Location,
  LocationDetails,
  LocationsHttpResponse,
} from "@/types/location";
import { FetchLocationsParams, http } from "./http";

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};
export type LoginRequest = {
  email: string;
  password: string;
};

type ApiErrorResponse = {
  error?: string;
  response?: {
    error?: string;
    message?: string;
  };
};

function getRequestError(error: unknown): Error {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.response?.message === "Email in use") {
      return new Error("Користувач із такою поштою вже існує.");
    }

    return new Error(
      data?.response?.message ??
        data?.response?.error ??
        data?.error ??
        error.message,
    );
  }

  return error instanceof Error
    ? error
    : new Error("Не вдалося зареєструватися. Спробуйте ще раз.");
}

function getLoginRequestError(error: unknown): Error {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    return new Error(
      data?.response?.message ??
        data?.response?.error ??
        data?.error ??
        error.message,
    );
  }

  return error instanceof Error
    ? error
    : new Error("Не вдалося увійти. Спробуйте ще раз.");
}

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
  const response = await http.get<LocationsHttpResponse>("/locations", {
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

export async function register(data: RegisterRequest): Promise<void> {
  try {
    await http.post("/auth/register", data);
  } catch (error) {
    throw getRequestError(error);
  }
}

export async function login(data: LoginRequest): Promise<void> {
  try {
    await http.post("/auth/login", data);
  } catch (error) {
    throw getLoginRequestError(error);
  }
}

export type CurrentUser = {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  name?: string;
};

type CurrentUserProfile = {
  status: number;
  data: CurrentUser;
};

export async function fetchCurrentUser(): Promise<CurrentUser> {
  try {
    const response = await http.get<CurrentUserProfile>("/users/me");
    return response.data.data;
  } catch (error) {
    throw getRequestError(error);
  }
}

export async function uploadUserImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await http.post<{ url: string }>(
      "/uploads/image",
      formData,
    );
    return response.data.url;
  } catch (error) {
    throw getRequestError(error);
  }
}

export type UpdateCurrentUserRequest = {
  username?: string;
  name?: string;
  avatarUrl?: string;
};

export async function updateCurrentUser(
  data: UpdateCurrentUserRequest,
): Promise<CurrentUser> {
  try {
    const response = await http.patch<CurrentUserProfile>("/users/me", data);
    return response.data.data;
  } catch (error) {
    throw getRequestError(error);
  }
}

export type RegionCategory = {
  _id: string;
  region: string;
  slug: string;
};

export type LocationTypeCategory = {
  _id: string;
  type: string;
  slug: string;
};

export async function fetchRegions(): Promise<RegionCategory[]> {
  try {
    const response = await http.get<RegionCategory[]>("/categories/regions");
    return response.data;
  } catch (error) {
    throw getRequestError(error);
  }
}

export async function fetchLocationTypes(): Promise<LocationTypeCategory[]> {
  try {
    const response =
      await http.get<LocationTypeCategory[]>("/categories/types");
    return response.data;
  } catch (error) {
    throw getRequestError(error);
  }
}

export async function createLocation(data: FormData): Promise<{ _id: string }> {
  try {
    const response = await http.post("/locations", data);
    return response.data;
  } catch (error) {
    throw getRequestError(error);
  }
}

export async function fetchLocationById(
  locationId: string,
): Promise<LocationDetails> {
  try {
    const response = await http.get<LocationDetails>(
      `/locations/${locationId}`,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 404) {
        throw new Error("Локацію не знайдено");
      }
    }

    throw getRequestError(error);
  }
}

export async function updateLocation(
  locationId: string,
  data: FormData,
): Promise<Location> {
  try {
    const response = await http.patch<Location>(
      `/locations/${locationId}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        throw new Error("Увійдіть в акаунт, щоб редагувати локацію");
      }

      if (status === 403) {
        throw new Error("Ви можете редагувати тільки власні локації");
      }

      if (status === 404) {
        throw new Error("Локацію не знайдено");
      }
    }

    throw getRequestError(error);
  }
}
