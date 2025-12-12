import { useMemo } from "react";
import { Layout, Table, Typography, Space, Spin, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import { StatisticsCard } from "@edu-stats/ui";
import { useInstitutions } from "./hooks/useInstitutions";
import type { Institution } from "./api/institutions";
import "./App.css";

const columns: ColumnsType<Institution> = [
  {
    title: "Institution",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <div>
        <Typography.Text strong>{text}</Typography.Text>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {record.stateProvince}, {record.country}
        </Typography.Paragraph>
      </div>
    )
  },
  {
    title: "Enrollment",
    dataIndex: "enrollment",
    key: "enrollment",
    align: "right",
    render: (value: number) => value.toLocaleString()
  }
];

function App() {
  const { data, isLoading, isError } = useInstitutions();
  const totalInstitutions = data?.totalCount ?? 0;
  const totalEnrollment = useMemo(
    () => data?.items.reduce((acc, inst) => acc + inst.enrollment, 0) ?? 0,
    [data?.items]
  );

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header">
        <Typography.Title level={3} style={{ color: "#fff", margin: 0 }}>
          Edu Stats Explorer
        </Typography.Title>
        <Typography.Text style={{ color: "#fff" }}>
          Higher education insights powered by the Edu Stats API
        </Typography.Text>
      </Layout.Header>
      <Layout.Content className="app-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className="stats-grid">
            <StatisticsCard
              title="Institutions tracked"
              value={totalInstitutions}
              trendLabel="Expandable via migrations"
            />
            <StatisticsCard
              title="Total enrollment"
              value={totalEnrollment}
              suffix="students"
              trendLabel="Latest query snapshot"
            />
          </div>
          {isError && (
            <Alert
              type="error"
              message="Unable to load institutions"
              description="Ensure the API container is running and reachable."
              showIcon
            />
          )}
          <Spin spinning={isLoading}>
            <Table
              rowKey="id"
              dataSource={data?.items ?? []}
              columns={columns}
              pagination={false}
            />
          </Spin>
        </Space>
      </Layout.Content>
    </Layout>
  );
}

export default App;
