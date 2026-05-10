import {
  Alert,
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState, type FormEvent } from "react";
import {
  getPasswordStrength,
  isValidEmail,
  strengthHint,
} from "../../utils/inputsValidation.utils.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import api from "../../utils/api.ts";

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
      const body =
        mode === "signin"
          ? { email, password }
          : { name: name.trim(), email, password };
      const endpoint = mode === "signin" ? "/auth/login" : "/auth/register";

      const res = await api.post(endpoint, body);
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
    <div>
      <div>
        <div>
          <Box sx={{ width: "100%" }}>
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
          </Box>

          <h1>{mode === "signin" ? "Welcome back" : "Join us"}</h1>
          <p>
            {mode === "signin"
              ? "Enter your email and password to continue"
              : "Fill in your details to create an account"}
          </p>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div>
          <form
            onSubmit={onSubmit}
            noValidate
            aria-labelledby={mode === "signin" ? "tab-signin" : "tab-signup"}
          >
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
            />

            <Button
              variant="contained"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>

            <Typography variant="caption" display="block" gutterBottom>
              {password && passwordStrengthText}
            </Typography>

            <Button
              variant="contained"
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
            >
              {submitting
                ? mode === "signin"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>

            <p>
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <Button variant="contained" onClick={() => setMode("signup")}>
                    Create one
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button variant="contained" onClick={() => setMode("signin")}>
                    Sign in
                  </Button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
