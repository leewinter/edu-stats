import { Layout } from "antd";
import type { MenuProps } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { NavigationHeader } from "@edu-stats/ui";
import "../App.css";

const AppLayout = () => {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/courses")
    ? "courses"
    : location.pathname.startsWith("/students")
      ? "students"
      : "dashboard";

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      label: <Link to="/">Dashboard</Link>
    },
    {
      key: "courses",
      label: <Link to="/courses">Courses</Link>
    },
    {
      key: "students",
      label: <Link to="/students">Students</Link>
    }
  ];

  return (
    <Layout className="app-layout">
      <NavigationHeader
        title="Edu Stats Explorer"
        subtitle="Higher education insights powered by the Edu Stats API"
        menuItems={menuItems}
        selectedKey={selectedKey}
      />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default AppLayout;
