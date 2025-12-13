import { useCallback, useMemo, useState } from "react";
import { Space, Alert, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InstitutionFormModal,
  type InstitutionFormValues,
  InstitutionsTable,
  StatisticsCard
} from "@edu-stats/ui";
import { useInstitutions } from "../hooks/useInstitutions";
import {
  createInstitution,
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

  const handleOpenEdit = useCallback((institution: Institution) => {
    setModalState({ mode: "edit", institution });
  }, []);

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
          />
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
