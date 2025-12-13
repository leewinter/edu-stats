import { Card, Statistic, Typography } from "antd";
import type { CardProps } from "antd";

export interface StatisticsCardProps extends CardProps {
  title: string;
  value: number;
  suffix?: string;
  trendLabel?: string;
}

/**
 * StatisticsCard provides a consistent wrapper around Ant Design's Card + Statistic components
 * so product surfaces can share formatting, colors, and typography.
 */
export const StatisticsCard = ({
  title,
  value,
  suffix,
  trendLabel,
  ...cardProps
}: StatisticsCardProps) => (
  <Card {...cardProps} aria-label={`${title} statistic`}>
    <Statistic title={title} value={value} suffix={suffix} precision={0} />
    {trendLabel && (
      <Typography.Text type="secondary" style={{ marginTop: 8 }}>
        {trendLabel}
      </Typography.Text>
    )}
  </Card>
);
