import { useQuery } from "@tanstack/react-query";
import { getStudentEnrollments } from "../api/enrollments";

export const useStudentEnrollments = (studentId?: string) => {
  return useQuery({
    queryKey: ["student-enrollments", studentId],
    queryFn: () => getStudentEnrollments(studentId!),
    enabled: Boolean(studentId)
  });
};
