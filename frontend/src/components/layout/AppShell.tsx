import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useThemeMode } from "../../contexts/ThemeContext.tsx";

export default function AppShell() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Crypto Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          {user && (
            <Typography variant="body2" sx={{ mx: 1.5 }}>
              {user.name || user.email}
            </Typography>
          )}
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
