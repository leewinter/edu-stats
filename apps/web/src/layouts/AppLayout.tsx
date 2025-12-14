import { Layout } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "@edu-stats/ui";
import eduStatsLogo from "../assets/edu-stats-logo.svg";
import "../App.css";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = location.pathname.startsWith("/courses")
    ? "courses"
    : location.pathname.startsWith("/students")
      ? "students"
      : location.pathname.startsWith("/institutions")
        ? "institutions"
        : "dashboard";

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      label: "Dashboard"
    },
    {
      key: "institutions",
      label: "Institutions"
    },
    {
      key: "courses",
      label: "Courses"
    },
    {
      key: "students",
      label: "Students"
    }
  ];

  return (
    <Layout className="app-layout">
      <NavigationHeader
        title="Edu Stats Explorer"
        subtitle="Higher education insights powered by the Edu Stats API"
        menuItems={menuItems}
        selectedKey={selectedKey}
        logoSrc={eduStatsLogo}
        logoAlt="Edu Stats logo"
        onLogoClick={() => navigate("/")}
        onSelect={(key) => {
          if (key === "dashboard") {
            navigate("/");
          } else {
            navigate(`/${key}`);
          }
        }}
      />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default AppLayout;
