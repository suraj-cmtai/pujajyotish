import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Toaster closeButton={true} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
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