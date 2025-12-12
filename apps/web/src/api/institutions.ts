import { apiClient } from "./client";

export interface Institution {
  id: string;
  name: string;
  country: string;
  county: string;
  enrollment: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const fetchInstitutions = async () => {
  const response = await apiClient.get<PagedResult<Institution>>("/api/institutions", {
    params: { pageNumber: 1, pageSize: 10 }
  });
  return response.data;
};
