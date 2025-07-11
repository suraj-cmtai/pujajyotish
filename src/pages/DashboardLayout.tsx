import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect mobile using Tailwind's md breakpoint (hidden on md and up)
  // We'll use CSS classes to hide/show, but for logic, we can use window.innerWidth or a custom hook if needed.
  // For now, keep logic simple and always allow open/close, but only show hamburger on mobile.

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Sidebar as drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative z-50 w-64 max-w-full h-full">
            <Sidebar isMobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-2 flex justify-center items-start">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 