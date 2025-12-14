import { useCallback, useMemo, useState } from "react";
import { Alert, Button, Space, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InstitutionFormModal, InstitutionsTable, type InstitutionFormValues } from "@edu-stats/ui";
import { useInstitutions } from "../hooks/useInstitutions";
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

const InstitutionsPage = () => {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError } = useInstitutions({ pageNumber, pageSize });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      handleCloseModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InstitutionInput }) =>
      updateInstitution(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      handleCloseModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    }
  });

  const handleOpenCreate = useCallback(() => setModalState({ mode: "create" }), []);

  const handleOpenEdit = useCallback((institution: Institution) => {
    setModalState({ mode: "edit", institution });
  }, []);

  const handleDelete = useCallback(
    async (institution: Institution) => {
      await deleteMutation.mutateAsync(institution.id);
    },
    [deleteMutation]
  );

  const handleCloseModal = () => setModalState(null);

  const handleSubmit = async (values: InstitutionFormValues) => {
    const payload = mapFormValuesToInput(values);
    if (modalState?.mode === "edit" && modalState.institution) {
      await updateMutation.mutateAsync({ id: modalState.institution.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;
  const mutationError =
    (createMutation.error as Error | null) ?? (updateMutation.error as Error | null);
  const mutationErrorMessage = mutationError?.message;

  const totalEnrollment = useMemo(
    () => data?.items.reduce((sum, inst) => sum + inst.enrollment, 0) ?? 0,
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
            <div>
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Institutions
              </Typography.Title>
              <Typography.Text type="secondary">
                {data?.totalCount ?? 0} institutions · {totalEnrollment.toLocaleString("en-GB")}{" "}
                students enrolled
              </Typography.Text>
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
            pagination={{
              current: pageNumber,
              pageSize,
              total: data?.totalCount ?? 0,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"]
            }}
            onChange={(pagination) => {
              if (pagination.current) {
                setPageNumber(pagination.current);
              }
              if (pagination.pageSize && pagination.pageSize !== pageSize) {
                setPageSize(pagination.pageSize);
                setPageNumber(1);
              }
            }}
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

export default InstitutionsPage;

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
