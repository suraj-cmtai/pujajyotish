import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store, persistor } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import DashboardLayout from "./pages/DashboardLayout"
import UsersPage from "./pages/UsersPage"
import BlogsPage from "./pages/BlogsPage"
import ProductsPage from "./pages/ProductsPage"
import PurohitsPage from "./pages/PurohitsPage"
import ServicesPage from "./pages/ServicesPage"
import DailyRoutinesPage from "./pages/DailyRoutinesPage"
import AppointmentsPage from "./pages/AppointmentsPage"
import LeadsPage from "./pages/LeadsPage"
import ProtectedRoute from "./pages/ProtectedRoute"
import HomePage from "./pages/HomePage";

// Import shadcn Button
import { Button } from "@/components/ui/button"

function DashboardHomePage() {
  // List of dashboard tabs (single tab per row)
  const tabs = [
    // { name: "Users", path: "users" },
    { name: "Home", path: "home" },
    { name: "Blogs", path: "blogs" },
    // { name: "Products", path: "products" },
    { name: "Purohits", path: "purohits" },
    // { name: "Services", path: "services" },
    { name: "Daily Routines", path: "dailyroutines" },
    { name: "Appointments", path: "appointments" },
    { name: "Leads", path: "leads" },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-8">
      <h2 className="text-xl font-bold mb-4">Dashboard Home</h2>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {tabs.map(tab => (
          <Button
            key={tab.path}
            variant="outline"
            className="w-full justify-center text-center"
            onClick={() => navigate(tab.path)}
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Toaster closeButton={true} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHomePage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="purohits" element={<PurohitsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="dailyroutines" element={<DailyRoutinesPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="leads" element={<LeadsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App