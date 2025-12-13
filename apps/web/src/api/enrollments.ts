import { apiClient } from "./client";

export type CourseEnrollmentStatus = "Active" | "Completed" | "Dropped";

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  status: CourseEnrollmentStatus;
  enrolledAtUtc: string;
}

export async function getStudentEnrollments(studentId: string) {
  const { data } = await apiClient.get<CourseEnrollment[]>(`/api/students/${studentId}/enrollments`);
  return data;
}

export async function enrollStudent(studentId: string, courseId: string) {
  const { data } = await apiClient.post<string>(`/api/students/${studentId}/enrollments`, {
    courseId
  });
  return data;
}
