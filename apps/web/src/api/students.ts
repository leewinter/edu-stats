import { apiClient } from "./client";

export interface Student {
  id: string;
  institutionId: string;
  institutionName: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentYear: number;
  courseFocus?: string | null;
}

export interface StudentInput {
  institutionId: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentYear: number;
  courseFocus?: string | null;
}

export interface PagedStudentResult {
  items: Student[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface FetchStudentsParams {
  pageNumber?: number;
  pageSize?: number;
  institutionId?: string;
}

export const fetchStudents = async ({
  pageNumber = 1,
  pageSize = 10,
  institutionId
}: FetchStudentsParams = {}) => {
  const response = await apiClient.get<PagedStudentResult>("/api/students", {
    params: { pageNumber, pageSize, institutionId }
  });
  return response.data;
};

export const createStudent = async (payload: StudentInput) => {
  const response = await apiClient.post<string>("/api/students", payload);
  return response.data;
};

export const updateStudent = async (id: string, payload: StudentInput) => {
  await apiClient.put(`/api/students/${id}`, payload);
};

export const deleteStudent = async (id: string) => {
  await apiClient.delete(`/api/students/${id}`);
};
