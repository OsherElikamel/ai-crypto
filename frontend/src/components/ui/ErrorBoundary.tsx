import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            px: 3,
          }}
        >
          <Stack alignItems="center" spacing={2} sx={{ textAlign: "center" }}>
            <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main" }} />
            <Typography variant="h5" fontWeight={700}>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
              An unexpected error occurred. Reloading the page usually fixes it.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload App
            </Button>
          </Stack>
        </Box>
      );
    }
    return this.props.children;
  }
}
