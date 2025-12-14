import { apiClient } from "./client";

export interface Course {
  id: string;
  institutionId: string;
  title: string;
  code: string;
  level: string;
  credits: number;
  description?: string | null;
  capacity?: number | null;
}

export interface CourseInput {
  institutionId: string;
  title: string;
  code: string;
  level: string;
  credits: number;
  description?: string | null;
  capacity?: number | null;
}

export interface PagedCourseResult {
  items: Course[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface FetchCoursesParams {
  pageNumber?: number;
  pageSize?: number;
  institutionId?: string;
}

export const fetchCourses = async ({
  pageNumber = 1,
  pageSize = 10,
  institutionId
}: FetchCoursesParams = {}) => {
  const response = await apiClient.get<PagedCourseResult>("/api/courses", {
    params: { pageNumber, pageSize, institutionId }
  });
  return response.data;
};

export const createCourse = async (payload: CourseInput) => {
  const response = await apiClient.post<string>("/api/courses", payload);
  return response.data;
};

export const updateCourse = async (id: string, payload: CourseInput) => {
  await apiClient.put(`/api/courses/${id}`, payload);
};

export const deleteCourse = async (id: string) => {
  await apiClient.delete(`/api/courses/${id}`);
};
