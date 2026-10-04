import { Region,Type } from "@/types/categories";
import { http } from "@/lib/api/http";


export async function getAllTypes(): Promise<Type[]> {
  const { data } = await http.get<Type[]>("/categories/types");
  return data; 
}

export async function getAllRegions(): Promise<Region[]> {
  const { data } = await http.get<Region[]>("/categories/regions");
  return data; 
}