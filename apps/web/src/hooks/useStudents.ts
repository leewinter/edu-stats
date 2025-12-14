import { useQuery } from "@tanstack/react-query";
import { fetchStudents, type FetchStudentsParams } from "../api/students";

export const useStudents = (params?: FetchStudentsParams) =>
  useQuery({
    queryKey: ["students", params?.institutionId ?? null, params?.pageNumber ?? 1, params?.pageSize ?? 10],
    queryFn: () => fetchStudents(params)
  });
