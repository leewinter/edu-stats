import { useMemo } from "react";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

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
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
}

export function InstitutionsTable({
  institutions,
  loading,
  onEdit,
  onDelete,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  showSizeChanger = true
}: InstitutionsTableProps) {
  const columns = useMemo<ColumnsType<InstitutionTableRow>>(() => {
    const baseColumns: ColumnsType<InstitutionTableRow> = [
      {
        title: "Institution",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        defaultSortOrder: "ascend",
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
        sorter: (a, b) => a.enrollment - b.enrollment,
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

  const pagination: TablePaginationConfig = {
    pageSize,
    showSizeChanger,
    pageSizeOptions: pageSizeOptions.map((size) => size.toString()),
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
  };

  return (
    <Table
      rowKey="id"
      dataSource={institutions}
      columns={columns}
      pagination={pagination}
      loading={loading}
    />
  );
}
