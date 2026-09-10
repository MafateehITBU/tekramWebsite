/** Safe http(s)/mailto/relative href, or null if the URL is not allowed. */
export function sanitizeHref(raw: string): string | null {
  let href = String(raw ?? "")
    .trim()
    .replace(/&amp;/gi, "&");
  if (!href) return null;
  if (/^(javascript|data|vbscript|file):/i.test(href)) return null;
  if (href.startsWith("//")) href = `https:${href}`;
  if (href.startsWith("/") && !href.startsWith("//")) {
    if (/[\s<>"'`]/.test(href)) return null;
    return href;
  }
  if (/^www\./i.test(href)) href = `https://${href}`;
  if (
    !/^[a-z][a-z0-9+.-]*:/i.test(href) &&
    /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#].*)?$/i.test(href)
  ) {
    href = `https://${href}`;
  }
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "mailto:") {
      return null;
    }
    return href;
  } catch {
    return null;
  }
}

export function looksLikeBareUrl(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  return Boolean(sanitizeHref(trimmed));
}

export function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function autoLinkPlainText(text: string): string {
  const re = /\b((?:https?:\/\/|www\.)[^\s<>"'()]+)/gi;
  const parts: string[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    parts.push(escapeHtml(text.slice(last, match.index)).replace(/\n/g, "<br>"));
    let raw = match[1];
    let trailing = "";
    const trail = raw.match(/[).,;:]+$/);
    if (trail) {
      trailing = trail[0];
      raw = raw.slice(0, -trailing.length);
    }
    const href = sanitizeHref(/^www\./i.test(raw) ? `https://${raw}` : raw);
    if (href) {
      parts.push(
        `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(raw)}</a>`
      );
    } else {
      parts.push(escapeHtml(raw));
    }
    parts.push(escapeHtml(trailing));
    last = match.index + match[0].length;
  }
  parts.push(escapeHtml(text.slice(last)).replace(/\n/g, "<br>"));
  return parts.join("");
}

export function stripHtmlToPlainText(html: string): string {
  return String(html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\b[^>]*>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function blogContentRequired(_: unknown, value: string | undefined): Promise<void> {
  if (value && stripHtmlToPlainText(value).length > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("Content is required"));
}
