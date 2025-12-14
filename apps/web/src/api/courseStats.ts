import { apiClient } from "./client";

export interface CourseStats {
  courseId: string;
  institutionId: string;
  institutionName: string;
  title: string;
  code: string;
  activeEnrollments: number;
  completedEnrollments: number;
  droppedEnrollments: number;
  capacity?: number | null;
}

export const fetchCourseStats = async (institutionId?: string) => {
  const { data } = await apiClient.get<CourseStats[]>("/api/courses/stats", {
    params: { institutionId }
  });
  return data;
};
