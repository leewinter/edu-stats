import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface CoursePerformanceRow {
  courseId: string;
  institutionName: string;
  title: string;
  code: string;
  activeEnrollments: number;
  completedEnrollments: number;
  droppedEnrollments: number;
}

export interface CoursePerformanceTableProps {
  data: CoursePerformanceRow[];
  loading?: boolean;
}

export const CoursePerformanceTable = ({ data, loading }: CoursePerformanceTableProps) => {
  const columns: ColumnsType<CoursePerformanceRow> = [
    {
      title: "Course",
      dataIndex: "title",
      key: "title",
      render: (value: string, record) => (
        <div>
          <Typography.Text strong>{value}</Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {record.code} · {record.institutionName}
          </Typography.Paragraph>
        </div>
      )
    },
    {
      title: "Active",
      dataIndex: "activeEnrollments",
      key: "activeEnrollments",
      align: "right"
    },
    {
      title: "Completed",
      dataIndex: "completedEnrollments",
      key: "completedEnrollments",
      align: "right"
    },
    {
      title: "Dropped",
      dataIndex: "droppedEnrollments",
      key: "droppedEnrollments",
      align: "right"
    }
  ];

  return (
    <Table
      rowKey="courseId"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
    />
  );
};
