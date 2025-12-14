import { useCallback, useMemo, useState } from "react";
import { Space, Alert, Button, Typography, Card } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InstitutionFormModal,
  type InstitutionFormValues,
  InstitutionsTable,
  StatisticsCard,
  CoursePerformanceTable,
  EnrollmentStatusChart
} from "@edu-stats/ui";
import { useInstitutions } from "../hooks/useInstitutions";
import { useCourseStats } from "../hooks/useCourseStats";
import {
  createInstitution,
  deleteInstitution,
  updateInstitution,
  type Institution,
  type InstitutionInput
} from "../api/institutions";
import "../App.css";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; institution: Institution };

const DashboardPage = () => {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const { data, isLoading, isError } = useInstitutions();
  const {
    data: courseStats,
    isLoading: statsLoading,
    isError: statsError
  } = useCourseStats();
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

  const deleteInstitutionMutation = useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    }
  });

  const handleOpenCreate = useCallback(() => {
    setModalState({ mode: "create" });
  }, []);

  const handleOpenEdit = useCallback((institution: Institution) => {
    setModalState({ mode: "edit", institution });
  }, []);

  const handleDelete = useCallback(
    async (institution: Institution) => {
      await deleteInstitutionMutation.mutateAsync(institution.id);
    },
    [deleteInstitutionMutation]
  );

  function handleCloseModal() {
    setModalState(null);
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

  const isSubmitting =
    createInstitutionMutation.isLoading || updateInstitutionMutation.isLoading;
  const mutationError =
    (createInstitutionMutation.error as Error | null) ??
    (updateInstitutionMutation.error as Error | null);
  const mutationErrorMessage = mutationError?.message;

  const totalInstitutions = data?.totalCount ?? 0;
  const totalEnrollment = useMemo(
    () => data?.items.reduce((acc, inst) => acc + inst.enrollment, 0) ?? 0,
    [data?.items]
  );

  const courseRows = useMemo(
    () =>
      (courseStats ?? []).map((stat) => ({
        courseId: stat.courseId,
        institutionName: stat.institutionName,
        title: stat.title,
        code: stat.code,
        activeEnrollments: stat.activeEnrollments,
        completedEnrollments: stat.completedEnrollments,
        droppedEnrollments: stat.droppedEnrollments,
        capacity: stat.capacity ?? null
      })),
    [courseStats]
  );

  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      { label: string; active: number; completed: number; dropped: number }
    >();

    (courseStats ?? []).forEach((stat) => {
      const key = stat.institutionName;
      if (!grouped.has(key)) {
        grouped.set(key, {
          label: key,
          active: 0,
          completed: 0,
          dropped: 0
        });
      }
      const entry = grouped.get(key)!;
      entry.active += stat.activeEnrollments;
      entry.completed += stat.completedEnrollments;
      entry.dropped += stat.droppedEnrollments;
    });

    return Array.from(grouped.values()).sort((a, b) => b.active - a.active);
  }, [courseStats]);

  return (
    <>
      <div className="app-content">
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
            onDelete={handleDelete}
          />
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Course performance
                </Typography.Title>
                {statsError && (
                  <Alert
                    type="error"
                    message="Unable to load course performance"
                    description="Ensure the API is reachable."
                    showIcon
                  />
                )}
                <CoursePerformanceTable data={courseRows} loading={statsLoading} />
              </Space>
            </Card>
            {chartData.length > 0 && (
              <EnrollmentStatusChart
                title="Enrollment by institution"
                data={chartData}
                height={260}
                limit={10}
              />
            )}
          </Space>
        </Space>
      </div>
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
    </>
  );
};

export default DashboardPage;

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
