import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "../../api";
import { Type } from "@/types/categories";

type ApiError = AxiosError<{ error: string }>;
export async function GET(): Promise<Response> {
  try {
    const { data } = await api.get<Type[]>("/categories/types");
    return NextResponse.json(data);
  } catch (error) {
    const axiosError = error as ApiError;
    const status = axiosError.response?.status ?? 500;

    return NextResponse.json(
      { error: axiosError.response?.data?.error ?? axiosError.message },
      { status: status },
    );
  }
}
