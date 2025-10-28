import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import {
  getPasswordStrength,
  isValidEmail,
  strengthHint,
} from "../../utils/inputsValidation.utils";
import { useNavigate } from "react-router-dom";
import { buildRequest } from "../../utils/auth.utils";

const Auth = () => {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = useMemo(() => isValidEmail(email), [email]);
  const passwordStrength = useMemo(
    () => strengthHint(getPasswordStrength(password)),
    [password]
  );

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!isEmailValid || password.length < 8) return false;
    if (mode === "signup") {
      if (!name.trim()) return false;
    }
    return true;
  }, [submitting, isEmailValid, password, mode, name]);

  const navigate = useNavigate();

  const inferNeedsOnboardingFromToken = (token) => {
    try {
      const base64 = token.split(".")[1];
      const decoded = JSON.parse(atob(base64));
      return decoded?.onboarded === false;
    } catch {
      return true;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const body =
        mode === "signin"
          ? { email, password }
          : { name: name.trim(), email, password };
      const endpoint = mode === "signin" ? "/auth/login" : "/auth/register";

      const res = await buildRequest(endpoint, body);
      const data = res.data;

      const token = data?.token;
      if (token) localStorage.setItem("auth_token", token);

      const needsOnboarding =
        typeof data?.needsOnboarding === "boolean"
          ? data.needsOnboarding
          : inferNeedsOnboardingFromToken(token);

      navigate(needsOnboarding ? "/onboarding" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      alert(err.message || "Something went wrong");
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
                onChange={(_, v) => setMode(v)}
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
              {password && passwordStrength}
            </Typography>

            <Button
              variant="contained"
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
            >
              {submitting
                ? mode === "signin"
                  ? "Signing in…"
                  : "Creating account…"
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
