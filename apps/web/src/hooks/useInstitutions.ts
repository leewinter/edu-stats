import { useQuery } from "@tanstack/react-query";
import { fetchInstitutions } from "../api/institutions";

export const useInstitutions = () =>
  useQuery({
    queryKey: ["institutions"],
    queryFn: fetchInstitutions
  });
