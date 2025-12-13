import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, Grid, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import type { Key, ReactNode } from "react";

type MenuItems = NonNullable<MenuProps["items"]>;
type MenuItem = MenuItems[number];

export interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  menuItems?: MenuProps["items"];
  selectedKey?: string;
  extra?: ReactNode;
  onSelect?: (key: string) => void;
}

export const NavigationHeader = ({
  title,
  subtitle,
  menuItems,
  selectedKey,
  extra,
  onSelect
}: NavigationHeaderProps) => {
  const normalizedMenuItems: MenuItems = Array.isArray(menuItems)
    ? (menuItems as MenuItems)
    : ([] as MenuItems);
  const screens = Grid.useBreakpoint();
  const isCompact = !screens.md;
  const selectedLabel = getSelectedMenuLabel(normalizedMenuItems, selectedKey) ?? "Navigate";

  return (
    <Layout.Header
      style={{
        display: "flex",
        alignItems: "center",
        background: "#001529",
        padding: isCompact ? "1rem 1.5rem" : "1.25rem 2.5rem"
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isCompact ? "column" : "row",
          alignItems: isCompact ? "flex-start" : "center",
          gap: "1rem",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 220,
            gap: "0.15rem"
          }}
        >
          <Typography.Title level={3} style={{ color: "#fff", margin: 0 }}>
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Text style={{ color: "#d6e4ff" }}>{subtitle}</Typography.Text>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: isCompact ? "column" : "row",
            alignItems: isCompact ? "stretch" : "center",
            gap: "1rem",
            marginLeft: isCompact ? 0 : "auto",
            width: isCompact ? "100%" : "auto"
          }}
        >
          {isCompact ? (
            <Dropdown
              trigger={["click"]}
              menu={{
                items: normalizedMenuItems,
                selectedKeys: selectedKey ? [selectedKey] : undefined,
                onClick: ({ key }) => onSelect?.(String(key))
              }}
            >
              <Button
                type="primary"
                icon={<MenuOutlined />}
                style={{ width: "100%", display: "flex", justifyContent: "space-between" }}
              >
                {selectedLabel}
              </Button>
            </Dropdown>
          ) : (
            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={selectedKey ? [selectedKey] : undefined}
              items={normalizedMenuItems}
              onClick={({ key }) => onSelect?.(String(key))}
              style={{
                background: "transparent",
                border: "none",
                minWidth: 200
              }}
            />
          )}
          {extra ? (
            <div style={{ color: "#fff", width: isCompact ? "100%" : "auto" }}>{extra}</div>
          ) : null}
        </div>
      </div>
    </Layout.Header>
  );
};

function getSelectedMenuLabel(items: MenuItems, selectedKey?: string) {
  if (!selectedKey || items.length === 0) return undefined;
  for (const item of items) {
    if (item && hasKey(item) && item.key === selectedKey) {
      if ("label" in item && typeof item.label === "string") {
        return item.label;
      }
    }
  }
  return undefined;
}

function hasKey(item: MenuItem): item is Extract<MenuItem, { key: Key }> {
  return Boolean(item && typeof item === "object" && "key" in item);
}
