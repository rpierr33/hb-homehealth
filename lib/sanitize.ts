const UNSAFE_CHARS: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

export function sanitizeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => UNSAFE_CHARS[char] || char);
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeHtml(value);
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map((v) =>
        typeof v === "string" ? sanitizeHtml(v) : v
      );
    }
  }
  return sanitized;
}
