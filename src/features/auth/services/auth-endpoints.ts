export const authEndpoints = {
  login: "/auth/login",
  register: "/auth/register",
  verifyEmail: "/auth/verify-email",
  resendCode: "/auth/resend-verification-code",
  forgotPassword: "/auth/forgot-password",
  validateResetToken: "/auth/password-reset/validate",
  resetPassword: "/auth/password-reset",
  session: "/auth/session",
  logout: "/auth/logout",
  oauth: (provider: string) => `/auth/oauth/${provider}`,
  oauthCallback: (provider: string) => `/auth/oauth/${provider}/callback`,
} as const;
