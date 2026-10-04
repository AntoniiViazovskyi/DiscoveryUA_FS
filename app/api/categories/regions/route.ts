import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "../../api";
import { Region } from "@/types/categories";

type ApiError = AxiosError<{ error: string }>;
export async function GET(): Promise<Response> {
  try {
    const { data } = await api.get<Region[]>("/categories/regions");
    return NextResponse.json(data);
  } catch (error) {
    const axiosError = error as ApiError;
    const status = axiosError.response?.status ?? 500;
    const errorMessage = axiosError.response?.data?.error ?? axiosError.message;
    return NextResponse.json({ error: errorMessage }, { status: status });
  }
}
