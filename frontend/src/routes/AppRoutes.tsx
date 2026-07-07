import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { CircularProgress, Box } from "@mui/material";
import Auth from "../pages/AuthPage.tsx";
import AppShell from "../components/layout/AppShell.tsx";

// Authenticated pages are code-split so the auth screen doesn't pay
// for the full dashboard bundle up front.
const Onboarding = lazy(() => import("../pages/OnboardingPage.tsx"));
const Dashboard = lazy(() => import("../pages/DashboardPage.tsx"));

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

function OnboardedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (user && !user.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function NotOnboardedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (user && user.onboarded) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { token, user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (token) return <Navigate to={user && !user.onboarded ? "/onboarding" : "/dashboard"} replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
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
        <Route path="/onboarding" element={<NotOnboardedRoute><Onboarding /></NotOnboardedRoute>} />
        <Route path="/dashboard" element={<OnboardedRoute><Dashboard /></OnboardedRoute>} />
      </Route>
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  );
}
