import { useMemo } from "react";
import { Button, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface InstitutionTableRow {
  id: string;
  name: string;
  country: string;
  county: string;
  enrollment: number;
}

export interface InstitutionsTableProps {
  institutions: InstitutionTableRow[];
  loading?: boolean;
  onEdit?: (institution: InstitutionTableRow) => void;
}

export function InstitutionsTable({
  institutions,
  loading,
  onEdit
}: InstitutionsTableProps) {
  const columns = useMemo<ColumnsType<InstitutionTableRow>>(() => {
    const baseColumns: ColumnsType<InstitutionTableRow> = [
      {
        title: "Institution",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <div>
            <Typography.Text strong>{text}</Typography.Text>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {record.county}, {record.country}
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

    if (onEdit) {
      baseColumns.push({
        title: "Actions",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
        )
      });
    }

    return baseColumns;
  }, [onEdit]);

  return (
    <Table
      rowKey="id"
      dataSource={institutions}
      columns={columns}
      pagination={false}
      loading={loading}
    />
  );
}
