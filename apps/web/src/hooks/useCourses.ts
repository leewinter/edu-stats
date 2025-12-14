import { useQuery } from "@tanstack/react-query";
import { fetchCourses, type FetchCoursesParams } from "../api/courses";

export const useCourses = (params?: FetchCoursesParams) =>
  useQuery({
    queryKey: [
      "courses",
      params?.institutionId ?? null,
      params?.pageNumber ?? 1,
      params?.pageSize ?? 10
    ],
    queryFn: () => fetchCourses(params)
  });
