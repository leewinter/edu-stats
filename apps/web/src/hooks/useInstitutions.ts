import { useQuery } from "@tanstack/react-query";
import { fetchInstitutions, type FetchInstitutionsParams } from "../api/institutions";

export const useInstitutions = (params?: FetchInstitutionsParams) =>
  useQuery({
    queryKey: ["institutions", params?.pageNumber ?? 1, params?.pageSize ?? 10],
    queryFn: () => fetchInstitutions(params)
  });
