import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useMemo } from "react";

export interface CourseTableRow {
  id: string;
  institutionId: string;
  institutionName?: string;
  title: string;
  code: string;
  level: string;
  credits: number;
  capacity?: number | null;
}

export interface CoursesTableProps {
  courses: CourseTableRow[];
  loading?: boolean;
  onEdit?: (course: CourseTableRow) => void;
  onDelete?: (course: CourseTableRow) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
}

export function CoursesTable({
  courses,
  loading,
  onEdit,
  onDelete,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  showSizeChanger = true
}: CoursesTableProps) {
  const columns = useMemo<ColumnsType<CourseTableRow>>(() => {
    const baseColumns: ColumnsType<CourseTableRow> = [
      {
        title: "Course",
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
        defaultSortOrder: "ascend",
        render: (text, record) => (
          <div>
            <Typography.Text strong>{text}</Typography.Text>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {record.code} - {record.level}
            </Typography.Paragraph>
          </div>
        )
      },
      {
        title: "Credits",
        dataIndex: "credits",
        key: "credits",
        align: "right",
        sorter: (a, b) => a.credits - b.credits
      },
      {
        title: "Capacity",
        dataIndex: "capacity",
        key: "capacity",
        align: "right",
        sorter: (a, b) => (a.capacity ?? 0) - (b.capacity ?? 0),
        render: (value?: number | null) => (value ? value.toString() : "-")
      },
      {
        title: "Institution",
        dataIndex: "institutionName",
        key: "institutionName",
        sorter: (a, b) => (a.institutionName ?? "").localeCompare(b.institutionName ?? "")
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

  const pagination: TablePaginationConfig = {
    pageSize,
    showSizeChanger,
    pageSizeOptions: pageSizeOptions.map((size) => size.toString()),
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
  };

  return (
    <Table
      rowKey="id"
      dataSource={courses}
      columns={columns}
      pagination={pagination}
      loading={loading}
    />
  );
}

