export function safeRedirectPath(value?: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f]/.test(value))
    return "/";
  const url = new URL(value, "https://app.invalid");
  if (
    url.origin !== "https://app.invalid" ||
    ["/login", "/renovar-sessao"].includes(url.pathname) ||
    url.pathname.startsWith("/api/")
  )
    return "/";
  return `${url.pathname}${url.search}${url.hash}`;
}
