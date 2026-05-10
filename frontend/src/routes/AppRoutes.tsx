import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { CircularProgress, Box } from "@mui/material";
import Auth from "../pages/AuthPage.tsx";
import Onboarding from "../pages/OnboardingPage.tsx";
import Dashboard from "../pages/DashboardPage.tsx";
import AppShell from "../components/layout/AppShell.tsx";
import type { ReactNode } from "react";

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route
        path="/auth"
        element={
          <GuestRoute>
            <Auth />
          </GuestRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
