import { useCallback, useMemo, useState } from "react";
import { Alert, Button, Space, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  StudentsTable,
  StudentFormModal,
  type StudentFormValues,
  StatisticsCard,
  StudentEnrollmentManager
} from "@edu-stats/ui";
import { useStudents } from "../hooks/useStudents";
import { useInstitutions } from "../hooks/useInstitutions";
import { useCourses } from "../hooks/useCourses";
import { useStudentEnrollments } from "../hooks/useStudentEnrollments";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  type Student,
  type StudentInput
} from "../api/students";
import { enrollStudent as enrollStudentApi } from "../api/enrollments";
import "../App.css";

type StudentModalState =
  | { mode: "create" }
  | { mode: "edit"; student: Student };

const StudentsPage = () => {
  const [modalState, setModalState] = useState<StudentModalState | null>(null);
  const [enrollmentStudent, setEnrollmentStudent] = useState<Student | null>(null);
  const { data, isLoading, isError } = useStudents();
  const { data: institutionData } = useInstitutions();
  const { data: coursesData } = useCourses(enrollmentStudent?.institutionId);
  const {
    data: enrollmentData,
    isLoading: enrollmentsLoading
  } = useStudentEnrollments(enrollmentStudent?.id);
  const queryClient = useQueryClient();

  const createStudentMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      handleCloseModal();
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StudentInput }) => updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      handleCloseModal();
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    }
  });

  const enrollMutation = useMutation({
    mutationFn: ({ studentId, courseId }: { studentId: string; courseId: string }) =>
      enrollStudentApi(studentId, courseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-enrollments", variables.studentId] });
    }
  });

  const handleOpenCreate = useCallback(() => {
    setModalState({ mode: "create" });
  }, []);

  const handleOpenEdit = useCallback((student: Student) => {
    setModalState({ mode: "edit", student });
  }, []);

  const handleOpenEnrollments = useCallback((student: Student) => {
    setEnrollmentStudent(student);
  }, []);

  const handleCloseEnrollments = () => setEnrollmentStudent(null);

  const handleCloseModal = () => setModalState(null);

  const handleDelete = useCallback(
    async (student: Student) => {
      await deleteStudentMutation.mutateAsync(student.id);
    },
    [deleteStudentMutation]
  );

  const handleSubmit = async (values: StudentFormValues) => {
    const payload = mapFormToInput(values);

    if (modalState?.mode === "edit" && modalState.student) {
      await updateStudentMutation.mutateAsync({ id: modalState.student.id, payload });
    } else {
      await createStudentMutation.mutateAsync(payload);
    }
  };

  const handleEnrollmentSubmit = async (courseId: string) => {
    if (!enrollmentStudent) return;
    await enrollMutation.mutateAsync({ studentId: enrollmentStudent.id, courseId });
  };

  const isSubmitting = createStudentMutation.isLoading || updateStudentMutation.isLoading;
  const mutationError =
    (createStudentMutation.error as Error | null) ?? (updateStudentMutation.error as Error | null);
  const mutationErrorMessage = mutationError?.message;

  const institutionOptions = (institutionData?.items ?? []).map((inst) => ({
    value: inst.id,
    label: inst.name
  }));

  const studentRows = useMemo(
    () => data?.items ?? [],
    [data?.items]
  );

  const enrollmentRows = useMemo(
    () =>
      (enrollmentData ?? []).map((enrollment) => ({
        id: enrollment.id,
        courseTitle: enrollment.courseTitle,
        courseCode: enrollment.courseCode,
        status: enrollment.status,
        enrolledAtUtc: enrollment.enrolledAtUtc
      })),
    [enrollmentData]
  );

  const availableCourses = useMemo(() => {
    if (!coursesData?.items) return [];
    const enrolledCourseIds = new Set(enrollmentData?.map((enr) => enr.courseId) ?? []);
    return coursesData.items
      .filter((course) => !enrolledCourseIds.has(course.id))
      .map((course) => ({
        value: course.id,
        label: `${course.title} (${course.code})`
      }));
  }, [coursesData?.items, enrollmentData]);

  const totalStudents = data?.totalCount ?? 0;

  return (
    <>
      <div className="app-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            align="center"
            style={{ width: "100%", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}
          >
            <StatisticsCard title="Students tracked" value={totalStudents} trendLabel="Live view" />
            <Button type="primary" onClick={handleOpenCreate}>
              Add student
            </Button>
          </Space>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Track student cohorts for each institution to understand enrolment trends.
          </Typography.Paragraph>
          {isError && (
            <Alert
              type="error"
              message="Unable to load students"
              description="Ensure the API container is running and reachable."
              showIcon
            />
          )}
          <StudentsTable
            students={studentRows}
            loading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onManageEnrollments={handleOpenEnrollments}
          />
        </Space>
      </div>
      <StudentFormModal
        open={modalState !== null}
        mode={modalState?.mode ?? "create"}
        loading={isSubmitting}
        errorMessage={mutationErrorMessage}
        institutionOptions={institutionOptions}
        initialValues={
          modalState?.mode === "edit" && modalState.student
            ? mapStudentToFormValues(modalState.student)
            : undefined
        }
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
      <StudentEnrollmentManager
        open={enrollmentStudent !== null}
        studentName={
          enrollmentStudent ? `${enrollmentStudent.firstName} ${enrollmentStudent.lastName}` : ""
        }
        enrollments={enrollmentRows}
        availableCourses={availableCourses}
        enrollmentLoading={enrollmentsLoading}
        submissionLoading={enrollMutation.isLoading}
        errorMessage={(enrollMutation.error as Error | null)?.message}
        onSubmit={handleEnrollmentSubmit}
        onClose={handleCloseEnrollments}
      />
    </>
  );
};

export default StudentsPage;

function mapFormToInput(values: StudentFormValues): StudentInput {
  return {
    institutionId: values.institutionId,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    enrollmentYear: values.enrollmentYear,
    courseFocus: values.courseFocus?.trim() || undefined
  };
}

function mapStudentToFormValues(student: Student): StudentFormValues {
  return {
    institutionId: student.institutionId,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    enrollmentYear: student.enrollmentYear,
    courseFocus: student.courseFocus ?? ""
  };
}
