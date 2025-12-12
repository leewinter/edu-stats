import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "../api/courses";

export const useCourses = (institutionId?: string) =>
  useQuery({
    queryKey: ["courses", institutionId],
    queryFn: () => fetchCourses(institutionId)
  });
