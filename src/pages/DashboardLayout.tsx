import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar onClose={() => {}} />
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout; 