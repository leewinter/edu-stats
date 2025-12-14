import { Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";

export interface CoursePerformanceRow {
  courseId: string;
  institutionName: string;
  title: string;
  code: string;
  activeEnrollments: number;
  completedEnrollments: number;
  droppedEnrollments: number;
  capacity?: number | null;
}

export interface CoursePerformanceTableProps {
  data: CoursePerformanceRow[];
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  pagination?: TablePaginationConfig;
  onChange?: TableProps<CoursePerformanceRow>["onChange"];
}

export const CoursePerformanceTable = ({
  data,
  loading,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  showSizeChanger = true,
  pagination,
  onChange
}: CoursePerformanceTableProps) => {
  const columns: ColumnsType<CoursePerformanceRow> = [
    {
      title: "Course",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      defaultSortOrder: "ascend",
      render: (value: string, record) => (
        <div>
          <Typography.Text strong>{value}</Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {record.code} - {record.institutionName}
          </Typography.Paragraph>
        </div>
      )
    },
    {
      title: "Active",
      dataIndex: "activeEnrollments",
      key: "activeEnrollments",
      align: "right",
      sorter: (a, b) => a.activeEnrollments - b.activeEnrollments
    },
    {
      title: "Completed",
      dataIndex: "completedEnrollments",
      key: "completedEnrollments",
      align: "right",
      sorter: (a, b) => a.completedEnrollments - b.completedEnrollments
    },
    {
      title: "Dropped",
      dataIndex: "droppedEnrollments",
      key: "droppedEnrollments",
      align: "right",
      sorter: (a, b) => a.droppedEnrollments - b.droppedEnrollments
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      align: "right",
      sorter: (a, b) => (a.capacity ?? 0) - (b.capacity ?? 0),
      render: (value: number | null | undefined, record) => {
        if (!value) {
          return "-";
        }

        const overSubscribed = record.activeEnrollments > value;

        return (
          <Space size={4}>
            {record.activeEnrollments}/{value}
            {overSubscribed && <Tag color="red">Over</Tag>}
          </Space>
        );
      }
    }
  ];

  const defaultPagination: TablePaginationConfig = {
    pageSize,
    showSizeChanger,
    pageSizeOptions: pageSizeOptions.map((size) => size.toString()),
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
  };

  return (
    <Table
      rowKey="courseId"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination ?? defaultPagination}
      onChange={onChange}
    />
  );
};
