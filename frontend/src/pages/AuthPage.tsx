import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useMemo, useState, type FormEvent } from "react";
import {
  getPasswordStrength,
  isValidEmail,
  strengthHint,
} from "../utils/inputsValidation.utils.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { loginUser, registerUser } from "../services/auth.service.ts";

type AuthMode = "signin" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = useMemo(() => isValidEmail(email), [email]);
  const passwordStrengthText = useMemo(
    () => strengthHint(getPasswordStrength(password)),
    [password]
  );

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!isEmailValid || password.length < 8) return false;
    if (mode === "signup" && !name.trim()) return false;
    return true;
  }, [submitting, isEmailValid, password, mode, name]);

  const inferNeedsOnboardingFromToken = (token: string): boolean => {
    try {
      const base64 = token.split(".")[1];
      const decoded = JSON.parse(atob(base64));
      return decoded?.onboarded === false;
    } catch {
      return true;
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    try {
      const res =
        mode === "signin"
          ? await loginUser({ email, password })
          : await registerUser({ name: name.trim(), email, password });
      const data = res.data;

      const token: string = data?.token;
      if (!token) throw new Error("No token received");

      const needsOnboarding =
        typeof data?.needsOnboarding === "boolean"
          ? data.needsOnboarding
          : inferNeedsOnboardingFromToken(token);

      login(token, needsOnboarding);
      navigate(needsOnboarding ? "/onboarding" : "/dashboard", {
        replace: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.06,
          filter: "blur(80px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          bgcolor: "secondary.main",
          opacity: 0.08,
          filter: "blur(60px)",
        }}
      />

      <Box sx={{ width: "100%", maxWidth: 420, px: 3, position: "relative", zIndex: 1 }}>
        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <CurrencyBitcoinIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Crypto Dashboard
          </Typography>
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={mode}
            onChange={(_, v: AuthMode) => setMode(v)}
            aria-label="auth tabs"
          >
            <Tab
              label="Create account"
              value="signup"
              id="tab-signup"
              aria-controls="panel-signup"
            />
            <Tab
              label="Sign in"
              value="signin"
              id="tab-signin"
              aria-controls="panel-signin"
            />
          </Tabs>
        </Box>

        <Typography variant="h4" fontWeight={700} sx={{ mt: 3 }}>
          {mode === "signin" ? "Welcome back" : "Join us"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {mode === "signin"
            ? "Enter your email and password to continue"
            : "Fill in your details to create an account"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate aria-labelledby={mode === "signin" ? "tab-signin" : "tab-signup"}>
          <Stack spacing={2}>
            {mode === "signup" && (
              <TextField
                id="name"
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!isEmailValid && !!email}
            />

            <TextField
              id="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              type={showPassword ? "text" : "password"}
              placeholder={
                mode === "signin" ? "Your password" : "Create a strong password"
              }
              aria-invalid={password.length > 0 && password.length < 8}
              helperText={password ? passwordStrengthText : undefined}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
              size="large"
              fullWidth
            >
              {submitting
                ? mode === "signin"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>

            <Typography variant="body2" align="center">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <Button size="small" onClick={() => setMode("signup")}>
                    Create one
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button size="small" onClick={() => setMode("signin")}>
                    Sign in
                  </Button>
                </>
              )}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
