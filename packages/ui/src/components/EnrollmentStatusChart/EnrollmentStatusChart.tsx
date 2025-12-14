import { Card, Space, Tag, Typography } from "antd";

export interface EnrollmentStatusDatum {
  label: string;
  active: number;
  completed: number;
  dropped: number;
}

export interface EnrollmentStatusChartProps {
  title?: string;
  data: EnrollmentStatusDatum[];
  height?: number;
  limit?: number;
}

const colors = {
  active: "#1677ff",
  completed: "#52c41a",
  dropped: "#ff4d4f"
};

export const EnrollmentStatusChart = ({
  title = "Enrollment mix",
  data,
  height = 220,
  limit
}: EnrollmentStatusChartProps) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  const max = Math.max(...limitedData.map((d) => d.active + d.completed + d.dropped), 1);

  return (
    <Card>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {title}
        </Typography.Title>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <div
            style={{
              height,
              minWidth: Math.max(limitedData.length * 110, 320),
              width: limitedData.length <= 5 ? "100%" : undefined,
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              padding: "0 4px"
            }}
          >
            {limitedData.map((datum) => {
              const total = datum.active + datum.completed + datum.dropped;
              const barHeight = Math.max((total / max) * (height - 40), 4);

              return (
                <div
                  key={datum.label}
                style={{
                  flex: limitedData.length <= 5 ? "1 1 0" : undefined,
                  width: limitedData.length <= 5 ? undefined : 110,
                  minWidth: limitedData.length <= 5 ? undefined : 110,
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    height: barHeight,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "#f0f0f0"
                  }}
                >
                  <div
                    style={{
                      background: colors.dropped,
                      height: `${(datum.dropped / total) * 100}%`
                    }}
                  />
                  <div
                    style={{
                      background: colors.completed,
                      height: `${(datum.completed / total) * 100}%`
                    }}
                  />
                  <div
                    style={{
                      background: colors.active,
                      height: `${(datum.active / total) * 100}%`
                    }}
                  />
                </div>
                <Typography.Text style={{ display: "block", marginTop: 8 }}>
                  {datum.label}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {total.toLocaleString()} total
                </Typography.Text>
              </div>
            );
          })}
          </div>
        </div>
        <Space size="small">
          <Tag color={colors.active}>Active</Tag>
          <Tag color={colors.completed}>Completed</Tag>
          <Tag color={colors.dropped}>Dropped</Tag>
        </Space>
      </Space>
    </Card>
  );
};
