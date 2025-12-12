import { useCallback, useMemo, useState } from "react";
import { Layout, Typography, Space, Alert, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InstitutionFormModal,
  type InstitutionFormValues,
  InstitutionsTable,
  CourseFormModal,
  type CourseFormValues,
  CoursesTable,
  StatisticsCard
} from "@edu-stats/ui";
import { useInstitutions } from "./hooks/useInstitutions";
import { useCourses } from "./hooks/useCourses";
import {
  createInstitution,
  updateInstitution,
  type Institution,
  type InstitutionInput
} from "./api/institutions";
import {
  createCourse,
  updateCourse,
  type Course,
  type CourseInput
} from "./api/courses";
import "./App.css";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; institution: Institution };

type CourseModalState =
  | { mode: "create" }
  | { mode: "edit"; course: Course };

function App() {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [courseModalState, setCourseModalState] = useState<CourseModalState | null>(null);
  const { data, isLoading, isError } = useInstitutions();
  const { data: courseData, isLoading: isCoursesLoading } = useCourses();
  const queryClient = useQueryClient();

  const createInstitutionMutation = useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      handleCloseModal();
    }
  });

  const updateInstitutionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InstitutionInput }) =>
      updateInstitution(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      handleCloseModal();
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      handleCloseCourseModal();
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CourseInput }) => updateCourse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      handleCloseCourseModal();
    }
  });

  const handleOpenCreate = useCallback(() => {
    setModalState({ mode: "create" });
  }, []);

  const handleOpenCreateCourse = useCallback(() => {
    setCourseModalState({ mode: "create" });
  }, []);

  const handleOpenEdit = useCallback(
    (institution: Institution) => {
      setModalState({ mode: "edit", institution });
    },
    []
  );

  const handleOpenEditCourse = useCallback((course: Course) => {
    setCourseModalState({ mode: "edit", course });
  }, []);

  function handleCloseModal() {
    setModalState(null);
  }

  function handleCloseCourseModal() {
    setCourseModalState(null);
  }

  const handleSubmit = async (values: InstitutionFormValues) => {
    const payload = mapFormValuesToInput(values);

    if (modalState?.mode === "edit" && modalState.institution) {
      await updateInstitutionMutation.mutateAsync({
        id: modalState.institution.id,
        payload
      });
    } else {
      await createInstitutionMutation.mutateAsync(payload);
    }
  };

  const handleCourseSubmit = async (values: CourseFormValues) => {
    const payload = mapCourseFormToInput(values);

    if (courseModalState?.mode === "edit" && courseModalState.course) {
      await updateCourseMutation.mutateAsync({
        id: courseModalState.course.id,
        payload
      });
    } else {
      await createCourseMutation.mutateAsync(payload);
    }
  };

  const isSubmitting =
    createInstitutionMutation.isLoading || updateInstitutionMutation.isLoading;
  const mutationError =
    (createInstitutionMutation.error as Error | null) ??
    (updateInstitutionMutation.error as Error | null);
  const mutationErrorMessage = mutationError?.message;

  const isCourseSubmitting =
    createCourseMutation.isLoading || updateCourseMutation.isLoading;
  const courseMutationError =
    (createCourseMutation.error as Error | null) ??
    (updateCourseMutation.error as Error | null);
  const courseMutationErrorMessage = courseMutationError?.message;

  const totalInstitutions = data?.totalCount ?? 0;
  const totalEnrollment = useMemo(
    () => data?.items.reduce((acc, inst) => acc + inst.enrollment, 0) ?? 0,
    [data?.items]
  );
  const institutionLookup = useMemo(() => {
    const map = new Map<string, string>();
    (data?.items ?? []).forEach((inst) => map.set(inst.id, inst.name));
    return map;
  }, [data?.items]);

  const courseRows = useMemo(
    () =>
      (courseData?.items ?? []).map((course) => ({
        ...course,
        institutionName: institutionLookup.get(course.institutionId) ?? "Unknown"
      })),
    [courseData?.items, institutionLookup]
  );

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header">
        <Typography.Title level={3} style={{ color: "#fff", margin: 0 }}>
          Edu Stats Explorer
        </Typography.Title>
        <Typography.Text style={{ color: "#fff" }}>
          Higher education insights powered by the Edu Stats API
        </Typography.Text>
      </Layout.Header>
      <Layout.Content className="app-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            align="center"
            style={{
              width: "100%",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap"
            }}
          >
            <div className="stats-grid" style={{ flex: 1 }}>
              <StatisticsCard
                title="Institutions tracked"
                value={totalInstitutions}
                trendLabel="Expandable via migrations"
              />
              <StatisticsCard
                title="Total enrollment"
                value={totalEnrollment}
                suffix="students"
                trendLabel="Latest query snapshot"
              />
            </div>
            <Button type="primary" onClick={handleOpenCreate}>
              Add institution
            </Button>
          </Space>
          {isError && (
            <Alert
              type="error"
              message="Unable to load institutions"
              description="Ensure the API container is running and reachable."
              showIcon
            />
          )}
          <InstitutionsTable
            institutions={data?.items ?? []}
            loading={isLoading}
            onEdit={handleOpenEdit}
          />
          <div>
            <Space
              direction="horizontal"
              align="center"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Typography.Title level={4} style={{ margin: 0 }}>
                Course catalog snapshot
              </Typography.Title>
              <Button type="primary" ghost onClick={handleOpenCreateCourse}>
                Add course
              </Button>
            </Space>
            <CoursesTable
              courses={courseRows}
              loading={isCoursesLoading}
              onEdit={handleOpenEditCourse}
            />
          </div>
        </Space>
      </Layout.Content>
      <InstitutionFormModal
        open={modalState !== null}
        mode={modalState?.mode ?? "create"}
        loading={isSubmitting}
        errorMessage={mutationErrorMessage}
        initialValues={
          modalState?.mode === "edit" && modalState.institution
            ? mapInstitutionToFormValues(modalState.institution)
            : undefined
        }
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
      <CourseFormModal
        open={courseModalState !== null}
        mode={courseModalState?.mode ?? "create"}
        loading={isCourseSubmitting}
        errorMessage={courseMutationErrorMessage}
        institutionOptions={(data?.items ?? []).map((inst) => ({
          value: inst.id,
          label: inst.name
        }))}
        initialValues={
          courseModalState?.mode === "edit" && courseModalState.course
            ? mapCourseToFormValues(courseModalState.course)
            : undefined
        }
        onCancel={handleCloseCourseModal}
        onSubmit={handleCourseSubmit}
      />
    </Layout>
  );
}

export default App;

function mapFormValuesToInput(values: InstitutionFormValues): InstitutionInput {
  const sanitizedAddresses = (values.addresses ?? [])
    .map((address) => ({
      line1: address.line1.trim(),
      line2: address.line2?.trim() || undefined,
      city: address.city.trim(),
      county: address.county.trim(),
      country: address.country.trim(),
      postalCode: address.postalCode.trim()
    }))
    .filter(
      (address) =>
        address.line1 && address.city && address.county && address.country && address.postalCode
    );

  if (sanitizedAddresses.length === 0) {
    sanitizedAddresses.push({
      line1: values.name,
      line2: undefined,
      city: "",
      county: "",
      country: "",
      postalCode: ""
    });
  }

  return {
    name: values.name,
    enrollment: values.enrollment,
    addresses: sanitizedAddresses
  };
}

function mapInstitutionToFormValues(institution: Institution): InstitutionFormValues {
  const addresses =
    institution.addresses.length > 0
      ? institution.addresses
      : [
          {
            line1: "",
            line2: "",
            city: "",
            county: "",
            country: "",
            postalCode: ""
          }
        ];

  return {
    name: institution.name,
    enrollment: institution.enrollment,
    addresses: addresses.map((address) => ({
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      county: address.county,
      country: address.country ?? "",
      postalCode: address.postalCode
    }))
  };
}

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
