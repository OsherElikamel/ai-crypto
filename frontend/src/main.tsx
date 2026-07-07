import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppThemeProvider } from "./contexts/ThemeContext.tsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AppThemeProvider>
  </StrictMode>
);
