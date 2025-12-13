import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

export interface StudentTableRow {
  id: string;
  institutionId: string;
  institutionName: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentYear: number;
  courseFocus?: string | null;
  activeEnrollmentCount?: number;
}

export interface StudentsTableProps {
  students: StudentTableRow[];
  loading?: boolean;
  onEdit?: (student: StudentTableRow) => void;
  onDelete?: (student: StudentTableRow) => void;
  onManageEnrollments?: (student: StudentTableRow) => void;
}

export function StudentsTable({
  students,
  loading,
  onEdit,
  onDelete,
  onManageEnrollments
}: StudentsTableProps) {
  const columns = useMemo<ColumnsType<StudentTableRow>>(() => {
    const baseColumns: ColumnsType<StudentTableRow> = [
      {
        title: "Student",
        dataIndex: "firstName",
        key: "student",
        render: (_, record) => (
          <div>
            <Typography.Text strong>
              {record.firstName} {record.lastName}
            </Typography.Text>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {record.email}
            </Typography.Paragraph>
          </div>
        )
      },
      {
        title: "Institution",
        dataIndex: "institutionName",
        key: "institutionName"
      },
      {
        title: "Enrollment year",
        dataIndex: "enrollmentYear",
        key: "enrollmentYear",
        align: "right"
      },
      {
        title: "Active courses",
        dataIndex: "activeEnrollmentCount",
        key: "activeEnrollmentCount",
        align: "right",
        render: (value?: number) => value ?? 0
      },
      {
        title: "Focus",
        dataIndex: "courseFocus",
        key: "courseFocus",
        render: (value?: string | null) => value ?? "—"
      }
    ];

    if (onEdit || onDelete || onManageEnrollments) {
      baseColumns.push({
        title: "Actions",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Space size="small">
            {onManageEnrollments && (
              <Button type="link" onClick={() => onManageEnrollments(record)}>
                Enrollments
              </Button>
            )}
            {onEdit && (
              <Button type="link" onClick={() => onEdit(record)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Popconfirm
                title="Delete student"
                description="Are you sure you want to remove this student?"
                okText="Delete"
                okType="danger"
                onConfirm={() => onDelete(record)}
              >
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      });
    }

    return baseColumns;
  }, [onDelete, onEdit, onManageEnrollments]);

  return (
    <Table
      rowKey="id"
      dataSource={students}
      columns={columns}
      pagination={false}
      loading={loading}
    />
  );
}
