import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#9C6B3D" },
    secondary: { main: "#EADBC8" },
    background: {
      default: "#E7D2BE",
      paper: "#FFF4E6",
    },
    text: {
      primary: "#3E2C23",
      secondary: "#6B5B53",
    },
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h6: { fontWeight: 600, letterSpacing: 0.2 },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: 16,
          margin: "24px auto 8px",
          width: "min(1200px, calc(100% - 64px))",
        },
        colorPrimary: { backgroundColor: "#9C6B3D" },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: { padding: "12px 16px" },
        title: { fontWeight: 600 },
        subheader: { color: "#6B5B53" },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: "12px 16px 16px" },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(62,44,35,0.08)" },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
          backgroundColor: "#FFF4E6",
        },
      },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 12 },
      },
    },
    MuiChip: { styleOverrides: { root: { background: "#F1E5D7" } } },
  },
});

export default theme;
