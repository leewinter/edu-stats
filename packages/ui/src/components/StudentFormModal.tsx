import { useEffect } from "react";
import { Alert, Form, Input, InputNumber, Modal, Select } from "antd";

export interface StudentFormValues {
  institutionId: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentYear: number;
  courseFocus?: string;
}

export interface StudentFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  errorMessage?: string;
  institutionOptions: { value: string; label: string }[];
  initialValues?: StudentFormValues;
  onCancel: () => void;
  onSubmit: (values: StudentFormValues) => Promise<void> | void;
}

export function StudentFormModal({
  open,
  mode,
  loading,
  errorMessage,
  institutionOptions,
  initialValues,
  onCancel,
  onSubmit
}: StudentFormModalProps) {
  const [form] = Form.useForm<StudentFormValues>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialValues ?? {
          institutionId: institutionOptions[0]?.value,
          firstName: "",
          lastName: "",
          email: "",
          enrollmentYear: new Date().getFullYear(),
          courseFocus: ""
        }
      );
    } else {
      form.resetFields();
    }
  }, [form, open, initialValues, institutionOptions]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch {
      // handled by form
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "edit" ? "Edit student" : "Add student"}
      okText={mode === "edit" ? "Save changes" : "Create"}
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
          message="Unable to save student"
          description={errorMessage}
        />
      )}
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Institution"
          name="institutionId"
          rules={[{ required: true, message: "Institution is required" }]}
        >
          <Select options={institutionOptions} placeholder="Select institution" />
        </Form.Item>
        <Form.Item
          label="First name"
          name="firstName"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input placeholder="Amelia" />
        </Form.Item>
        <Form.Item
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input placeholder="Hughes" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Valid email required" }]}
        >
          <Input placeholder="amelia@example.com" />
        </Form.Item>
        <Form.Item
          label="Enrollment year"
          name="enrollmentYear"
          rules={[{ required: true, message: "Enrollment year is required" }]}
        >
          <InputNumber min={1950} max={2100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Course focus" name="courseFocus">
          <Input placeholder="e.g. Data Science" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
