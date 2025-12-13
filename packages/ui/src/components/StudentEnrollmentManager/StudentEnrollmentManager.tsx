import { Drawer, Space, Table, Tag, Typography, Form, Select, Button, Alert } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";

export interface StudentEnrollmentRecord {
  id: string;
  courseTitle: string;
  courseCode: string;
  status: string;
  enrolledAtUtc: string;
}

export interface StudentEnrollmentManagerProps {
  open: boolean;
  studentName: string;
  enrollments: StudentEnrollmentRecord[];
  availableCourses: { label: string; value: string }[];
  enrollmentLoading?: boolean;
  submissionLoading?: boolean;
  errorMessage?: string;
  onSubmit: (courseId: string) => void;
  onDropEnrollment?: (enrollmentId: string) => void;
  onClose: () => void;
}

export const StudentEnrollmentManager = ({
  open,
  studentName,
  enrollments,
  availableCourses,
  enrollmentLoading,
  submissionLoading,
  errorMessage,
  onSubmit,
  onDropEnrollment,
  onClose
}: StudentEnrollmentManagerProps) => {
  const [form] = Form.useForm<{ courseId: string }>();
  const [selectedCourseId, setSelectedCourseId] = useState<string>();

  const columns = useMemo<TableColumnsType<StudentEnrollmentRecord>>(() => {
    const base: TableColumnsType<StudentEnrollmentRecord> = [
      {
        title: "Course",
        dataIndex: "courseTitle",
        key: "courseTitle",
        render: (value: string, record) => (
          <div>
            <Typography.Text strong>{value}</Typography.Text>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {record.courseCode}
            </Typography.Paragraph>
          </div>
        )
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (value: string) => <Tag color={statusTagColor(value)}>{value}</Tag>
      },
      {
        title: "Enrolled",
        dataIndex: "enrolledAtUtc",
        key: "enrolledAtUtc",
        render: (value: string) => new Date(value).toLocaleDateString()
      }
    ];

    if (onDropEnrollment) {
      base.push({
        title: "Actions",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Button
            type="link"
            danger
            disabled={record.status?.toLowerCase() === "dropped"}
            onClick={() => onDropEnrollment(record.id)}
          >
            Remove
          </Button>
        )
      });
    }

    return base;
  }, [onDropEnrollment]);

  const handleSubmit = (values: { courseId: string }) => {
    onSubmit(values.courseId);
    form.resetFields();
    setSelectedCourseId(undefined);
  };

  return (
    <Drawer
      open={open}
      title={`Manage enrollments for ${studentName}`}
      width={520}
      onClose={onClose}
      destroyOnClose
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Typography.Title level={5} style={{ marginBottom: 12 }}>
            Enroll in a course
          </Typography.Title>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{ courseId: undefined }}
          >
            <Form.Item
              name="courseId"
              label="Available courses"
              rules={[{ required: true, message: "Select a course to enroll" }]}
            >
              <Select
                placeholder="Select a course"
                options={availableCourses}
                value={selectedCourseId}
                onChange={(value) => setSelectedCourseId(value)}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            {errorMessage && (
              <Alert type="error" message={errorMessage} showIcon style={{ marginBottom: 12 }} />
            )}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={submissionLoading}>
                Enroll student
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>
          <Typography.Title level={5} style={{ marginBottom: 12 }}>
            Current enrollments
          </Typography.Title>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={enrollments}
            loading={enrollmentLoading}
            pagination={false}
            locale={{
              emptyText: "No enrollments yet"
            }}
          />
        </div>
      </Space>
    </Drawer>
  );
};

function statusTagColor(status: string | undefined | null) {
  const normalized = typeof status === "string" ? status.toLowerCase() : "";
  switch (normalized) {
    case "completed":
      return "green";
    case "dropped":
      return "red";
    default:
      return "blue";
  }
}
