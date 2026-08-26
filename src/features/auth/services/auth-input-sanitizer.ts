const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;
const HTML_DELIMITERS = /[<>]/g;

export function sanitizeText(value: string): string {
  return value.normalize("NFKC").replace(CONTROL_CHARACTERS, "").replace(HTML_DELIMITERS, "").trim();
}

export function sanitizeEmail(value: string): string {
  return sanitizeText(value).toLowerCase();
}

export function sanitizeUsername(value: string): string {
  return sanitizeText(value);
}
