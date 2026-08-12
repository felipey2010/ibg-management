export const authEndpoints = {
  login: "/auth/login",
  register: "/auth/register",
  verifyEmail: "/auth/verify-email",
  resendCode: "/auth/resend-verification-code",
  forgotPassword: "/auth/forgot-password",
  validateResetToken: "/auth/password-reset/validate",
  resetPassword: "/auth/password-reset",
  logout: "/auth/logout",
  oauth: (provider: string) => `/auth/oauth/${provider}`,
} as const;
