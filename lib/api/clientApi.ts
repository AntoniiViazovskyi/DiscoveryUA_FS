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
  message?: string;
  response?: {
    error?: string;
    message?: string;
  };
};

function getRequestError(error: unknown): Error {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const message = data?.response?.message ?? data?.response?.error ?? data?.message ?? data?.error;
    const messages: Record<string, string> = {
      "Email in use": "Користувач із такою поштою вже існує.",
      "Invalid email or password": "Неправильна пошта або пароль.",
      "Not authorized": "Увійдіть у свій акаунт, щоб продовжити.",
      "Access token expired": "Сесія завершилася. Увійдіть знову.",
      "Session not found or invalid": "Сесія завершилася. Увійдіть знову.",
      "Session expired, please log in again": "Сесія завершилася. Увійдіть знову.",
      "User not found": "Користувача не знайдено.",
      "Location not found": "Локацію не знайдено.",
      "Image is required": "Додайте фотографію.",
      "Only JPG and PNG files are allowed": "Дозволені тільки фотографії JPG та PNG.",
      "You can edit only your own locations": "Ви можете редагувати тільки власні локації.",
      "At least one field is required": "Змініть хоча б одне поле.",
      "File too large": "Розмір фотографії перевищує допустимий.",
      "User has no valid username": "Перевірте ім’я у своєму профілі.",
    };
    if (message && messages[message]) return new Error(messages[message]);
    if (!error.response) return new Error("Не вдалося з’єднатися із сервером. Спробуйте ще раз.");
    const status = error.response.status;
    if (status === 401) return new Error("Сесія завершилася. Увійдіть знову.");
    if (status === 403) return new Error("У вас немає доступу до цієї дії.");
    if (status === 404) return new Error("Запитані дані не знайдено.");
    if (status === 409) return new Error("Такі дані вже використовуються.");
    if (status === 413) return new Error("Розмір фотографії перевищує допустимий.");
    if (status === 400 || status === 422) return new Error("Перевірте введені дані та спробуйте ще раз.");
    if (status === 429) return new Error("Забагато запитів. Спробуйте трохи пізніше.");
    return new Error("Сервер тимчасово недоступний. Спробуйте пізніше.");
  }
  return error instanceof Error && /[А-Яа-яІіЇїЄєҐґ]/.test(error.message)
    ? error
    : new Error("Не вдалося виконати дію. Спробуйте ще раз.");
}

function getLoginRequestError(error: unknown): Error {
  return getRequestError(error);
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
  const response = await http.get<
    LocationsHttpResponse & { totalItems?: number }
  >("/locations", {
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

  return {
    ...response.data,
    totalLocations: response.data.totalLocations ?? response.data.totalItems ?? 0,
  };
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

export async function logout(): Promise<void> {
  await http.post("/auth/logout");
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
