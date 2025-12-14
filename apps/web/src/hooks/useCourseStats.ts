import { useQuery } from "@tanstack/react-query";
import { fetchCourseStats } from "../api/courseStats";

export const useCourseStats = (institutionId?: string) =>
  useQuery({
    queryKey: ["course-stats", institutionId],
    queryFn: () => fetchCourseStats(institutionId)
  });
