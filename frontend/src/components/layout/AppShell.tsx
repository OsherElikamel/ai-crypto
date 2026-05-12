import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
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
          <CurrencyBitcoinIcon sx={{ mr: 1, fontSize: 24 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Crypto Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          {user && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 1, pl: 1.5, borderLeft: 1, borderColor: "rgba(255,255,255,0.15)" }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {(user.name || user.email).charAt(0).toUpperCase()}
              </Box>
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                {user.name || user.email}
              </Typography>
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={logout} aria-label="logout" size="small">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
