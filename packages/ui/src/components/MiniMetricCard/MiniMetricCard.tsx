import { Card, Space, Tag, Typography } from "antd";

export interface MiniMetricCardProps {
  title: string;
  value: string;
  deltaLabel?: string;
  deltaType?: "positive" | "negative" | "neutral";
  caption?: string;
}

const deltaColors: Record<NonNullable<MiniMetricCardProps["deltaType"]>, string> = {
  positive: "green",
  negative: "red",
  neutral: "default"
};

export const MiniMetricCard = ({
  title,
  value,
  deltaLabel,
  deltaType = "neutral",
  caption
}: MiniMetricCardProps) => (
  <Card size="small">
    <Space direction="vertical" size={4} style={{ width: "100%" }}>
      <Typography.Text type="secondary">{title}</Typography.Text>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {value}
      </Typography.Title>
      {deltaLabel && (
        <Tag color={deltaColors[deltaType]} style={{ width: "fit-content" }}>
          {deltaLabel}
        </Tag>
      )}
      {caption && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {caption}
        </Typography.Text>
      )}
    </Space>
  </Card>
);
