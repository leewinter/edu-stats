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
}

export interface StudentsTableProps {
  students: StudentTableRow[];
  loading?: boolean;
  onEdit?: (student: StudentTableRow) => void;
  onDelete?: (student: StudentTableRow) => void;
}

export function StudentsTable({ students, loading, onEdit, onDelete }: StudentsTableProps) {
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
<<<<<<< HEAD
        key: "institutionName"
=======
        key: "institution"
>>>>>>> edf7032 (feat: add students feature)
      },
      {
        title: "Enrollment year",
        dataIndex: "enrollmentYear",
        key: "enrollmentYear",
        align: "right"
      },
      {
<<<<<<< HEAD
        title: "Focus",
=======
        title: "Course focus",
>>>>>>> edf7032 (feat: add students feature)
        dataIndex: "courseFocus",
        key: "courseFocus",
        render: (value?: string | null) => value ?? "—"
      }
    ];

    if (onEdit || onDelete) {
      baseColumns.push({
        title: "Actions",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Space size="small">
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
  }, [onDelete, onEdit]);

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
