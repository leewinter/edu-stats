import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

export interface CourseTableRow {
  id: string;
  institutionId: string;
  institutionName?: string;
  title: string;
  code: string;
  level: string;
  credits: number;
}

export interface CoursesTableProps {
  courses: CourseTableRow[];
  loading?: boolean;
  onEdit?: (course: CourseTableRow) => void;
  onDelete?: (course: CourseTableRow) => void;
}

export function CoursesTable({ courses, loading, onEdit, onDelete }: CoursesTableProps) {
  const columns = useMemo<ColumnsType<CourseTableRow>>(() => {
    const baseColumns: ColumnsType<CourseTableRow> = [
      {
        title: "Course",
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <div>
            <Typography.Text strong>{text}</Typography.Text>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {record.code} · {record.level}
            </Typography.Paragraph>
          </div>
        )
      },
      {
        title: "Credits",
        dataIndex: "credits",
        key: "credits",
        align: "right"
      },
      {
        title: "Institution",
        dataIndex: "institutionName",
        key: "institutionName"
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
                title="Delete course"
                description="Are you sure you want to remove this course?"
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
      dataSource={courses}
      columns={columns}
      pagination={false}
      loading={loading}
    />
  );
}
