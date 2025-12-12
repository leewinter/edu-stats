import { apiClient } from "./client";

export interface Institution {
  id: string;
  name: string;
  country: string;
  county: string;
  enrollment: number;
}

export interface InstitutionInput {
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

export const createInstitution = async (payload: InstitutionInput) => {
  const response = await apiClient.post<string>("/api/institutions", payload);
  return response.data;
};

export const updateInstitution = async (id: string, payload: InstitutionInput) => {
  await apiClient.put(`/api/institutions/${id}`, payload);
};
