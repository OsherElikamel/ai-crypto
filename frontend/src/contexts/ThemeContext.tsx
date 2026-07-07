import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme_mode";

const sharedTypography = {
  fontFamily:
    'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  h6: { fontWeight: 600, letterSpacing: 0.2 },
};

function buildTheme(mode: ThemeMode) {
  const isLight = mode === "light";

  const border = isLight
    ? "1px solid rgba(44,30,20,0.1)"
    : "1px solid rgba(255,255,255,0.07)";

  return createTheme({
    palette: {
      mode,
      primary: { main: isLight ? "#7B5134" : "#C8865E" },
      secondary: { main: isLight ? "#D4B896" : "#5C4A3A" },
      background: {
        default: isLight ? "#F0E8E0" : "#121010",
        paper: isLight ? "#FFFFFF" : "#1C1816",
      },
      text: {
        primary: isLight ? "#2C1E14" : "#EDE5DC",
        secondary: isLight ? "#7A685C" : "#A89585",
      },
      divider: isLight ? "rgba(44,30,20,0.1)" : "rgba(255,255,255,0.07)",
    },
    shape: { borderRadius: 6 },
    typography: sharedTypography,
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: border,
          },
          colorPrimary: {
            backgroundColor: isLight ? "#5C3A22" : "#1C1816",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: { padding: "10px 16px" },
          title: { fontWeight: 600, fontSize: "0.9rem" },
          subheader: { color: isLight ? "#7A685C" : "#A89585", fontSize: "0.75rem" },
        },
      },
      MuiCardContent: {
        styleOverrides: { root: { padding: "12px 16px 16px" } },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            border,
            backgroundColor: isLight ? "#FFFFFF" : "#1C1816",
          },
        },
      },
      MuiPaper: { defaultProps: { elevation: 0 as const } },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none" as const, fontWeight: 600, borderRadius: 6 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight
              ? "rgba(44,30,20,0.1)"
              : "rgba(237,229,220,0.07)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 22,
            fontSize: "0.7rem",
            background: isLight ? "#F0E6DA" : "#2A221C",
            color: isLight ? "#5C3A22" : "#C8865E",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: `@keyframes spin { to { transform: rotate(360deg); } }`,
      },
    },
  });
}

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeContext value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {/* enableColorScheme keeps native widgets and scrollbars in sync with the theme */}
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within AppThemeProvider");
  return ctx;
}
