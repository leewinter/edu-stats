import { useEffect } from "react";
import { Alert, Form, Input, InputNumber, Modal, Typography } from "antd";

export interface InstitutionAddressFormValue {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  country: string;
  postalCode: string;
}

export interface InstitutionFormValues {
  name: string;
  enrollment: number;
  addresses: InstitutionAddressFormValue[];
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
      const defaults = createDefaultFormValues();
      const populated =
        initialValues && initialValues.addresses?.length
          ? initialValues
          : initialValues
          ? { ...initialValues, addresses: defaults.addresses }
          : defaults;

      form.setFieldsValue(populated);
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
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Institution name is required" }]}
        >
          <Input placeholder="e.g. University of Edinburgh" />
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

        <Typography.Title level={5}>Primary address</Typography.Title>
        <Form.List name="addresses" initialValue={createDefaultFormValues().addresses}>
          {(fields) =>
            fields.map((field) => (
              <div key={field.key}>
                <Form.Item
                  label="Address line 1"
                  name={[field.name, "line1"]}
                  rules={[{ required: true, message: "Address line 1 is required" }]}
                >
                  <Input placeholder="Old College" />
                </Form.Item>
                <Form.Item
                  label="Address line 2"
                  name={[field.name, "line2"]}
                >
                  <Input placeholder="Optional" />
                </Form.Item>
                <Form.Item
                  label="City"
                  name={[field.name, "city"]}
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Input placeholder="Edinburgh" />
                </Form.Item>
                <Form.Item
                  label="County"
                  name={[field.name, "county"]}
                  rules={[{ required: true, message: "County is required" }]}
                >
                  <Input placeholder="City of Edinburgh" />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name={[field.name, "country"]}
                  rules={[{ required: true, message: "Country is required" }]}
                >
                  <Input placeholder="United Kingdom" />
                </Form.Item>
                <Form.Item
                  label="Postal code"
                  name={[field.name, "postalCode"]}
                  rules={[{ required: true, message: "Postal code is required" }]}
                >
                  <Input placeholder="EH8 9YL" />
                </Form.Item>
              </div>
            ))
          }
        </Form.List>
      </Form>
    </Modal>
  );
}

function createDefaultFormValues(): InstitutionFormValues {
  return {
    name: "",
    enrollment: 0,
    addresses: [
      {
        line1: "",
        line2: "",
        city: "",
        county: "",
        country: "",
        postalCode: ""
      }
    ]
  };
}
