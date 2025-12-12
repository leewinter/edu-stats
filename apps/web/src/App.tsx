import { useCallback, useMemo, useState } from "react";
import { Layout, Typography, Space, Alert, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InstitutionFormModal,
  InstitutionsTable,
  StatisticsCard
} from "@edu-stats/ui";
import { useInstitutions } from "./hooks/useInstitutions";
import {
  createInstitution,
  updateInstitution,
  type Institution,
  type InstitutionInput
} from "./api/institutions";
import "./App.css";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; institution: Institution };

function App() {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const { data, isLoading, isError } = useInstitutions();
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

  const handleOpenCreate = useCallback(() => {
    setModalState({ mode: "create" });
  }, []);

  const handleOpenEdit = useCallback(
    (institution: Institution) => {
      setModalState({ mode: "edit", institution });
    },
    []
  );

  function handleCloseModal() {
    setModalState(null);
  }

  const handleSubmit = async (values: InstitutionInput) => {
    if (modalState?.mode === "edit" && modalState.institution) {
      await updateInstitutionMutation.mutateAsync({
        id: modalState.institution.id,
        payload: values
      });
    } else {
      await createInstitutionMutation.mutateAsync(values);
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
        </Space>
      </Layout.Content>
      <InstitutionFormModal
        open={modalState !== null}
        mode={modalState?.mode ?? "create"}
        loading={isSubmitting}
        errorMessage={mutationErrorMessage}
        initialValues={
          modalState?.mode === "edit" && modalState.institution
            ? {
                name: modalState.institution.name,
                country: modalState.institution.country,
                county: modalState.institution.county,
                enrollment: modalState.institution.enrollment
              }
            : undefined
        }
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
}

export default App;
