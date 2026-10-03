import { isAxiosError } from "axios";

import { LocationsHttpResponse } from "@/types/location";
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
