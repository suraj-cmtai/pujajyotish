import React from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import type { RootState } from "../store"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    toast.error("You must be logged in as admin to access this page.")
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

export default ProtectedRoute 