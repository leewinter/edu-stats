import { apiClient } from "./client";

export interface InstitutionAddress {
  line1: string;
  line2?: string | null;
  city: string;
  county: string;
  country: string;
  postalCode: string;
}

export type InstitutionAddressInput = InstitutionAddress;

export interface Institution {
  id: string;
  name: string;
  enrollment: number;
  addresses: InstitutionAddress[];
}

export interface InstitutionInput {
  name: string;
  enrollment: number;
  addresses: InstitutionAddressInput[];
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

export const deleteInstitution = async (id: string) => {
  await apiClient.delete(`/api/institutions/${id}`);
};
