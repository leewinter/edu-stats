import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../api/students";

export const useStudents = (institutionId?: string) =>
  useQuery({
    queryKey: ["students", institutionId],
    queryFn: () => fetchStudents(institutionId)
  });
