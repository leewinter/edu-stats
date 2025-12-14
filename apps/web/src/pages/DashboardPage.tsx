import { useCallback, useMemo } from "react";
import { Space, Alert, Button, Typography, Card } from "antd";
import {
  StatisticsCard,
  CoursePerformanceTable,
  EnrollmentStatusChart,
  MiniMetricCard
} from "@edu-stats/ui";
import { useInstitutions } from "../hooks/useInstitutions";
import { useCourseStats } from "../hooks/useCourseStats";
import { useNavigate } from "react-router-dom";
import "../App.css";

const DashboardPage = () => {
  const { data, isLoading, isError } = useInstitutions();
  const {
    data: courseStats,
    isLoading: statsLoading,
    isError: statsError
  } = useCourseStats();
  const navigate = useNavigate();

  const formatNumber = useCallback(
    (value: number) => value.toLocaleString("en-GB"),
    []
  );

  const totalInstitutions = data?.totalCount ?? 0;
  const totalEnrollment = useMemo(
    () => data?.items.reduce((acc, inst) => acc + inst.enrollment, 0) ?? 0,
    [data?.items]
  );
  const totalActiveEnrollments = useMemo(
    () => courseStats?.reduce((sum, stat) => sum + stat.activeEnrollments, 0) ?? 0,
    [courseStats]
  );
  const totalCompletedEnrollments = useMemo(
    () => courseStats?.reduce((sum, stat) => sum + stat.completedEnrollments, 0) ?? 0,
    [courseStats]
  );
  const totalDroppedEnrollments = useMemo(
    () => courseStats?.reduce((sum, stat) => sum + stat.droppedEnrollments, 0) ?? 0,
    [courseStats]
  );
  const totalCapacity = useMemo(
    () => courseStats?.reduce((sum, stat) => sum + (stat.capacity ?? 0), 0) ?? 0,
    [courseStats]
  );
  const utilization = totalCapacity > 0
    ? Math.min((totalActiveEnrollments / totalCapacity) * 100, 999).toFixed(1)
    : "0";
  const completionRate = (() => {
    const denominator = totalActiveEnrollments + totalCompletedEnrollments + totalDroppedEnrollments;
    return denominator > 0 ? ((totalCompletedEnrollments / denominator) * 100).toFixed(1) : "0";
  })();
  const globalDropRate = (() => {
    const denominator = totalActiveEnrollments + totalCompletedEnrollments + totalDroppedEnrollments;
    return denominator > 0 ? ((totalDroppedEnrollments / denominator) * 100).toFixed(1) : "0";
  })();

  const courseRows = useMemo(
    () =>
      (courseStats ?? []).map((stat) => ({
        courseId: stat.courseId,
        institutionName: stat.institutionName,
        title: stat.title,
        code: stat.code,
        activeEnrollments: stat.activeEnrollments,
        completedEnrollments: stat.completedEnrollments,
        droppedEnrollments: stat.droppedEnrollments,
        capacity: stat.capacity ?? null
      })),
    [courseStats]
  );

  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      { label: string; active: number; completed: number; dropped: number }
    >();

    (courseStats ?? []).forEach((stat) => {
      const key = stat.institutionName;
      if (!grouped.has(key)) {
        grouped.set(key, {
          label: key,
          active: 0,
          completed: 0,
          dropped: 0
        });
      }
      const entry = grouped.get(key)!;
      entry.active += stat.activeEnrollments;
      entry.completed += stat.completedEnrollments;
      entry.dropped += stat.droppedEnrollments;
    });

    return Array.from(grouped.values()).sort((a, b) => b.active - a.active);
  }, [courseStats]);

  return (
    <>
      <div className="app-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            align="center"
            style={{
              width: "100%",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap"
            }}
          >
            <div className="stats-grid" style={{ flex: 1 }}>
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
            <Button type="primary" onClick={() => navigate("/institutions")}>
              Manage institutions
            </Button>
          </Space>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16
            }}
          >
            <MiniMetricCard
              title="Active enrollments"
              value={formatNumber(totalActiveEnrollments)}
              deltaLabel={`${utilization}% capacity used`}
              deltaType="positive"
            />
            <MiniMetricCard
              title="Completed enrollments"
              value={formatNumber(totalCompletedEnrollments)}
              deltaLabel={`${completionRate}% completion`}
              deltaType="positive"
            />
            <MiniMetricCard
              title="Dropped enrollments"
              value={formatNumber(totalDroppedEnrollments)}
              deltaLabel={`${globalDropRate}% drop rate`}
              deltaType="negative"
            />
            <MiniMetricCard
              title="Total capacity"
              value={formatNumber(totalCapacity)}
              caption="Summed across all active courses"
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
          {isLoading && (
            <Typography.Text type="secondary">Loading latest institution snapshot…</Typography.Text>
          )}
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Course performance
                </Typography.Title>
                {statsError && (
                  <Alert
                    type="error"
                    message="Unable to load course performance"
                    description="Ensure the API is reachable."
                    showIcon
                  />
                )}
                <CoursePerformanceTable data={courseRows} loading={statsLoading} />
              </Space>
            </Card>
            {chartData.length > 0 && (
              <EnrollmentStatusChart
                title="Enrollment by institution"
                data={chartData}
                height={260}
                limit={10}
              />
            )}
          </Space>
        </Space>
      </div>
    </>
  );
};

export default DashboardPage;
