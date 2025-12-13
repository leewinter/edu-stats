import { useMemo } from "react";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface InstitutionAddressRow {
  line1: string;
  line2?: string | null;
  city: string;
  county: string;
  country: string;
  postalCode: string;
}

export interface InstitutionTableRow {
  id: string;
  name: string;
  enrollment: number;
  addresses: InstitutionAddressRow[];
}

export interface InstitutionsTableProps {
  institutions: InstitutionTableRow[];
  loading?: boolean;
  onEdit?: (institution: InstitutionTableRow) => void;
  onDelete?: (institution: InstitutionTableRow) => void;
}

export function InstitutionsTable({
  institutions,
  loading,
  onEdit,
  onDelete
}: InstitutionsTableProps) {
  const columns = useMemo<ColumnsType<InstitutionTableRow>>(() => {
    const baseColumns: ColumnsType<InstitutionTableRow> = [
      {
        title: "Institution",
        dataIndex: "name",
        key: "name",
        render: (text, record) => {
          const primaryAddress = record.addresses?.[0];
          return (
            <div>
              <Typography.Text strong>{text}</Typography.Text>
              {primaryAddress && (
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {primaryAddress.county}, {primaryAddress.country}
                </Typography.Paragraph>
              )}
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {primaryAddress
                  ? `${primaryAddress.line1}, ${primaryAddress.city}, ${primaryAddress.postalCode}`
                  : "No address on file"}
              </Typography.Paragraph>
            </div>
          );
        }
      },
      {
        title: "Enrollment",
        dataIndex: "enrollment",
        key: "enrollment",
        align: "right",
        render: (value: number) => value.toLocaleString()
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
                title="Delete institution"
                description="This will remove the institution and its courses."
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
      dataSource={institutions}
      columns={columns}
      pagination={false}
      loading={loading}
    />
  );
}
