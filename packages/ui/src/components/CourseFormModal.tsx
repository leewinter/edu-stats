import { useEffect } from "react";
import { Alert, Form, Input, InputNumber, Modal, Select } from "antd";

export interface CourseFormValues {
  institutionId: string;
  title: string;
  code: string;
  level: string;
  credits: number;
  description?: string;
}

export interface CourseFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  errorMessage?: string;
  initialValues?: CourseFormValues;
  institutionOptions: Array<{ label: string; value: string }>;
  onCancel: () => void;
  onSubmit: (values: CourseFormValues) => Promise<void> | void;
}

export function CourseFormModal({
  open,
  mode,
  loading,
  errorMessage,
  initialValues,
  institutionOptions,
  onCancel,
  onSubmit
}: CourseFormModalProps) {
  const [form] = Form.useForm<CourseFormValues>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialValues ?? {
          institutionId: institutionOptions[0]?.value,
          title: "",
          code: "",
          level: "",
          credits: 0,
          description: ""
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
      // validation errors handled by form
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "edit" ? "Edit course" : "Add course"}
      okText={mode === "edit" ? "Save changes" : "Create"}
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
          message="Unable to save course"
          description={errorMessage}
        />
      )}
      <Form form={form} layout="vertical">
        <Form.Item
          label="Institution"
          name="institutionId"
          rules={[{ required: true, message: "Institution is required" }]}
        >
          <Select options={institutionOptions} placeholder="Select institution" />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Course title is required" }]}
        >
          <Input placeholder="Computer Science BSc" />
        </Form.Item>
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Course code is required" }]}
        >
          <Input placeholder="CS101" />
        </Form.Item>
        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: "Course level is required" }]}
        >
          <Input placeholder="Undergraduate" />
        </Form.Item>
        <Form.Item
          label="Credits"
          name="credits"
          rules={[
            { required: true, message: "Credits are required" },
            { type: "number", min: 1, message: "Credits must be positive" }
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="120" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Optional description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
