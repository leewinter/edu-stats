import { useCallback, useMemo, useState } from "react";
import { Alert, Button, Space, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CourseFormModal,
  CoursesTable,
  type CourseFormValues,
  StatisticsCard
} from "@edu-stats/ui";
import { useCourses } from "../hooks/useCourses";
import { useInstitutions } from "../hooks/useInstitutions";
import {
  createCourse,
  deleteCourse,
  updateCourse,
  type Course,
  type CourseInput
} from "../api/courses";
import "../App.css";

type CourseModalState =
  | { mode: "create" }
  | { mode: "edit"; course: Course };

const CoursesPage = () => {
  const [modalState, setModalState] = useState<CourseModalState | null>(null);
  const { data, isLoading, isError } = useCourses();
  const { data: institutionData } = useInstitutions();
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      handleCloseModal();
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CourseInput }) => updateCourse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      handleCloseModal();
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    }
  });

  const handleOpenCreate = useCallback(() => {
    setModalState({ mode: "create" });
  }, []);

  const handleOpenEdit = useCallback((course: Course) => {
    setModalState({ mode: "edit", course });
  }, []);

  const handleDelete = useCallback(
    async (course: Course) => {
      await deleteCourseMutation.mutateAsync(course.id);
    },
    [deleteCourseMutation]
  );

  function handleCloseModal() {
    setModalState(null);
  }

  const handleSubmit = async (values: CourseFormValues) => {
    const payload = mapCourseFormToInput(values);

    if (modalState?.mode === "edit" && modalState.course) {
      await updateCourseMutation.mutateAsync({
        id: modalState.course.id,
        payload
      });
    } else {
      await createCourseMutation.mutateAsync(payload);
    }
  };

  const isSubmitting = createCourseMutation.isLoading || updateCourseMutation.isLoading;
  const mutationError =
    (createCourseMutation.error as Error | null) ??
    (updateCourseMutation.error as Error | null);
  const mutationErrorMessage = mutationError?.message;

  const institutionLookup = useMemo(() => {
    const map = new Map<string, string>();
    (institutionData?.items ?? []).forEach((inst) => map.set(inst.id, inst.name));
    return map;
  }, [institutionData?.items]);

  const courseRows = useMemo(
    () =>
      (data?.items ?? []).map((course) => ({
        ...course,
        institutionName: institutionLookup.get(course.institutionId) ?? "Unknown"
      })),
    [data?.items, institutionLookup]
  );

  const totalCourses = data?.totalCount ?? 0;

  return (
    <>
      <div className="app-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            align="center"
            style={{ width: "100%", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}
          >
            <StatisticsCard title="Courses catalogued" value={totalCourses} trendLabel="Live view" />
            <Button type="primary" onClick={handleOpenCreate}>
              Add course
            </Button>
          </Space>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Manage courses independently of the institution dashboard. Use the institution selector
            in the form to associate each course with its provider.
          </Typography.Paragraph>
          {isError && (
            <Alert
              type="error"
              message="Unable to load courses"
              description="Ensure the API container is running and reachable."
              showIcon
            />
          )}
          <CoursesTable
            courses={courseRows}
            loading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </Space>
      </div>
      <CourseFormModal
        open={modalState !== null}
        mode={modalState?.mode ?? "create"}
        loading={isSubmitting}
        errorMessage={mutationErrorMessage}
        institutionOptions={(institutionData?.items ?? []).map((inst) => ({
          value: inst.id,
          label: inst.name
        }))}
        initialValues={
          modalState?.mode === "edit" && modalState.course
            ? mapCourseToFormValues(modalState.course)
            : undefined
        }
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CoursesPage;

function mapCourseFormToInput(values: CourseFormValues): CourseInput {
  return {
    institutionId: values.institutionId,
    title: values.title.trim(),
    code: values.code.trim(),
    level: values.level.trim(),
    credits: values.credits,
    description: values.description?.trim() || undefined
  };
}

function mapCourseToFormValues(course: Course): CourseFormValues {
  return {
    institutionId: course.institutionId,
    title: course.title,
    code: course.code,
    level: course.level,
    credits: course.credits,
    description: course.description ?? ""
  };
}
