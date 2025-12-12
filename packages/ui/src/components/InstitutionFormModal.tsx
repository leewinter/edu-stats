import { useEffect } from "react";
import { Alert, Form, Input, InputNumber, Modal } from "antd";

export interface InstitutionFormValues {
  name: string;
  country: string;
  county: string;
  enrollment: number;
}

export interface InstitutionFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  errorMessage?: string;
  initialValues?: InstitutionFormValues;
  onCancel: () => void;
  onSubmit: (values: InstitutionFormValues) => Promise<void> | void;
}

export function InstitutionFormModal({
  open,
  mode,
  loading,
  errorMessage,
  initialValues,
  onCancel,
  onSubmit
}: InstitutionFormModalProps) {
  const [form] = Form.useForm<InstitutionFormValues>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialValues ?? { name: "", country: "", county: "", enrollment: 0 }
      );
    } else {
      form.resetFields();
    }
  }, [form, open, initialValues]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch {
      // handled by Ant Design form validation
    }
  };

  const modalTitle = mode === "edit" ? "Edit institution" : "Add institution";
  const okText = mode === "edit" ? "Save changes" : "Create";

  return (
    <Modal
      open={open}
      title={modalTitle}
      okText={okText}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      {errorMessage && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message="Unable to save institution"
          description={errorMessage}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ?? { name: "", country: "", county: "", enrollment: 0 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Institution name is required" }]}
        >
          <Input placeholder="e.g. University of Edinburgh" />
        </Form.Item>
        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: "Country is required" }]}
        >
          <Input placeholder="United Kingdom" />
        </Form.Item>
        <Form.Item
          label="County"
          name="county"
          rules={[{ required: true, message: "County is required" }]}
        >
          <Input placeholder="Midlothian" />
        </Form.Item>
        <Form.Item
          label="Enrollment"
          name="enrollment"
          rules={[
            { required: true, message: "Enrollment is required" },
            { type: "number", min: 0, message: "Enrollment must be positive" }
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="32000" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
