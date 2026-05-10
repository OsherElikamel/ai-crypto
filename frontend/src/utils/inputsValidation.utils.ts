const EMAIL_REGEX =
  /^(?:[a-zA-Z0-9_'^&+%`{}~|-]+(?:\.[a-zA-Z0-9_'^&+%`{}~|-]+)*|"(?:[^"]|\\")+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const getPasswordStrength = (pw: string): number => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, Math.max(0, score - 1));
};

const STRENGTH_HINTS = [
  "Too weak — use 8+ chars",
  "Weak — add numbers & symbols",
  "Fair — consider more variety",
  "Good — strong enough",
  "Great — very strong",
] as const;

export const strengthHint = (level: number): string => {
  return STRENGTH_HINTS[level] ?? "";
};
