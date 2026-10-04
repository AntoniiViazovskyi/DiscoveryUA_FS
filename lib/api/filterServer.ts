import { api } from "@/app/api/api";
import { Type, Region } from "@/types/categories";

export async function getAllTypesServer(): Promise<Type[]> {
  const { data } = await api.get<Type[]>("/categories/types");
  return data;
}

export async function getAllRegionsServer(): Promise<Region[]> {
  const { data } = await api.get<Region[]>("/categories/regions");
  return data;
}