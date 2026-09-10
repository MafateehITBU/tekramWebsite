import { useEffect, useRef, useState, type ClipboardEvent } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  LineOutlined,
  LinkOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input, Modal, Space, Tooltip, Typography, message } from "antd";
import {
  autoLinkPlainText,
  escapeHtml,
  looksLikeBareUrl,
  sanitizeHref,
} from "../lib/htmlContent";

export const RICH_COLOR_PRIMARY = "#00502e";
export const RICH_COLOR_SECONDARY = "#dfb026";

type RichHtmlEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  minHeight?: number;
  /** Brand colors (#00502e, #dfb026) and horizontal divider (#e0e0e0). */
  extended?: boolean;
};

type BlockTag = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type ColorClass = "text-primary" | "text-secondary";

const HEADING_BUTTONS: { tag: BlockTag; label: string }[] = [
  { tag: "h1", label: "H1" },
  { tag: "h2", label: "H2" },
  { tag: "h3", label: "H3" },
  { tag: "h4", label: "H4" },
  { tag: "h5", label: "H5" },
  { tag: "h6", label: "H6" },
];

function toEditorHtml(value: string | undefined): string {
  if (!value?.trim()) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

const ALLOWED_COLOR_CLASSES = new Set(["text-primary", "text-secondary"]);

function stampSafeAnchors(root: HTMLElement) {
  root.querySelectorAll("a").forEach((anchor) => {
    const safe = sanitizeHref(anchor.getAttribute("href") || "");
    if (!safe) {
      const parent = anchor.parentNode;
      if (!parent) {
        anchor.remove();
        return;
      }
      while (anchor.firstChild) {
        parent.insertBefore(anchor.firstChild, anchor);
      }
      anchor.remove();
      return;
    }
    anchor.setAttribute("href", safe);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  });
}

function findAnchor(node: Node | null, stop: HTMLElement | null): HTMLAnchorElement | null {
  let current: Node | null = node;
  while (current && current !== stop) {
    if (current instanceof HTMLAnchorElement) return current;
    current = current.parentNode;
  }
  return null;
}

/** Unwrap browser-generated spans (styles) that are not brand color spans. */
function normalizeEditorHtml(html: string): string {
  if (!html?.trim()) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;

  body.querySelectorAll("span").forEach((span) => {
    const hasColorClass = [...span.classList].some((c) => ALLOWED_COLOR_CLASSES.has(c));
    if (hasColorClass) return;
    const parent = span.parentNode;
    if (!parent) return;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    span.remove();
  });

  body.querySelectorAll("font").forEach((font) => {
    const parent = font.parentNode;
    if (!parent) return;
    while (font.firstChild) {
      parent.insertBefore(font.firstChild, font);
    }
    font.remove();
  });

  stampSafeAnchors(body);
  return body.innerHTML;
}

export function RichHtmlEditor({
  value,
  onChange,
  dir = "ltr",
  placeholder = "Write content…",
  minHeight = 280,
  extended = false,
}: RichHtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | undefined>(undefined);
  const savedRange = useRef<Range | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = toEditorHtml(value);
    if (lastEmitted.current === value && el.innerHTML === next) return;
    if (el.innerHTML !== next) {
      el.innerHTML = next;
    }
  }, [value]);

  const emitChange = () => {
    const el = editorRef.current;
    if (!el) return;
    stampSafeAnchors(el);
    const raw = el.innerHTML ?? "";
    const html = extended ? normalizeEditorHtml(raw) : raw;
    if (extended && html !== raw) {
      el.innerHTML = html;
    }
    lastEmitted.current = html;
    onChange?.(html);
  };

  const rememberSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const el = editorRef.current;
    const range = savedRange.current;
    if (!el || !range) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const applyFormat = (command: "bold" | "italic" | "underline") => {
    editorRef.current?.focus();
    document.execCommand(command);
    emitChange();
  };

  const applyBlock = (tag: BlockTag) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    emitChange();
  };

  const applyColorClass = (className: ColorClass) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.className = className;
    try {
      range.surroundContents(span);
      sel.removeAllRanges();
      const after = document.createRange();
      after.selectNodeContents(span);
      after.collapse(false);
      sel.addRange(after);
    } catch {
      const text = range.toString();
      if (!text) return;
      document.execCommand(
        "insertHTML",
        false,
        `<span class="${className}">${text}</span>`
      );
    }
    emitChange();
  };

  const insertDivider = () => {
    editorRef.current?.focus();
    document.execCommand("insertHorizontalRule");
    const el = editorRef.current;
    if (el) {
      const hrs = el.querySelectorAll("hr");
      const last = hrs[hrs.length - 1];
      if (last && !last.classList.contains("rich-divider")) {
        last.classList.add("rich-divider");
      }
    }
    emitChange();
  };

  const openLinkModal = () => {
    const el = editorRef.current;
    el?.focus();
    rememberSelection();
    const sel = window.getSelection();
    const existing = findAnchor(sel?.anchorNode ?? null, el);
    const selected = sel?.toString() ?? "";
    setLinkUrl(existing?.getAttribute("href") || (looksLikeBareUrl(selected) ? selected.trim() : ""));
    setLinkOpen(true);
  };

  const applyLink = () => {
    const safe = sanitizeHref(linkUrl);
    if (!safe) {
      message.error("Enter a valid http(s), mailto, or site path URL.");
      return;
    }
    restoreSelection();
    const el = editorRef.current;
    const sel = window.getSelection();
    const existing = findAnchor(sel?.anchorNode ?? null, el);
    if (existing) {
      existing.setAttribute("href", safe);
      existing.setAttribute("target", "_blank");
      existing.setAttribute("rel", "noopener noreferrer");
    } else if (sel && !sel.isCollapsed) {
      document.execCommand("createLink", false, safe);
    } else {
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${escapeHtml(safe)}</a>`
      );
    }
    if (el) stampSafeAnchors(el);
    emitChange();
    setLinkOpen(false);
    setLinkUrl("");
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const text = event.clipboardData.getData("text/plain");
    const trimmed = text.trim();
    if (!trimmed) return;

    if (looksLikeBareUrl(trimmed) && !trimmed.includes("\n")) {
      event.preventDefault();
      const href = sanitizeHref(trimmed);
      if (!href) return;
      const sel = window.getSelection();
      const label = sel && !sel.isCollapsed ? sel.toString() : trimmed;
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
      );
      emitChange();
      return;
    }

    if (/\b(?:https?:\/\/|www\.)/i.test(text)) {
      event.preventDefault();
      document.execCommand("insertHTML", false, autoLinkPlainText(text));
      emitChange();
    }
  };

  const isEmpty = !value || value === "<br>" || !stripTags(value).trim();

  return (
    <div>
    <div className="rich-html-editor" style={{ minHeight: minHeight + 52 }}>
      <Space wrap className="rich-html-editor__toolbar" split={<Divider type="vertical" />}>
        <Space size={4} wrap>
          {HEADING_BUTTONS.map(({ tag, label }) => (
            <Button
              key={tag}
              size="small"
              type="text"
              aria-label={`Heading ${label}`}
              className="rich-html-editor__heading-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyBlock(tag)}
            >
              {label}
            </Button>
          ))}
          <Button
            size="small"
            type="text"
            aria-label="Paragraph"
            className="rich-html-editor__heading-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyBlock("p")}
          >
            P
          </Button>
        </Space>

        <Space size={4}>
          <Button
            type="text"
            aria-label="Bold"
            icon={<BoldOutlined />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormat("bold")}
          />
          <Button
            type="text"
            aria-label="Italic"
            icon={<ItalicOutlined />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormat("italic")}
          />
          <Button
            type="text"
            aria-label="Underline"
            icon={<UnderlineOutlined />}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormat("underline")}
          />
          <Tooltip title="Insert link">
            <Button
              type="text"
              aria-label="Insert link"
              icon={<LinkOutlined />}
              onMouseDown={(e) => e.preventDefault()}
              onClick={openLinkModal}
            />
          </Tooltip>
        </Space>

        {extended ? (
          <Space size={4}>
            <Tooltip title={`Primary (${RICH_COLOR_PRIMARY})`}>
              <Button
                size="small"
                type="text"
                aria-label="Primary color"
                className="rich-html-editor__color-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyColorClass("text-primary")}
              >
                <span
                  className="rich-html-editor__swatch"
                  style={{ backgroundColor: RICH_COLOR_PRIMARY }}
                />
              </Button>
            </Tooltip>
            <Tooltip title={`Secondary (${RICH_COLOR_SECONDARY})`}>
              <Button
                size="small"
                type="text"
                aria-label="Secondary color"
                className="rich-html-editor__color-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyColorClass("text-secondary")}
              >
                <span
                  className="rich-html-editor__swatch"
                  style={{ backgroundColor: RICH_COLOR_SECONDARY }}
                />
              </Button>
            </Tooltip>
            <Tooltip title="Horizontal line">
              <Button
                size="small"
                type="text"
                aria-label="Insert horizontal line"
                icon={<LineOutlined />}
                onMouseDown={(e) => e.preventDefault()}
                onClick={insertDivider}
              />
            </Tooltip>
          </Space>
        ) : null}
      </Space>

      <div
        ref={editorRef}
        className={[
          "rich-html-editor__surface",
          extended ? "rich-html-editor__surface--extended" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        contentEditable
        dir={dir}
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        style={{ minHeight }}
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={handlePaste}
      />
    </div>

      {isEmpty ? (
        <Typography.Text type="secondary" style={{ display: "block", marginTop: 6, fontSize: 12 }}>
          {extended
            ? "Headings, bold/italic/underline, links, brand colors, and horizontal lines are supported. Pasted URLs become links."
            : "Use H1–H6 for headings, P for normal text, the icons for bold, italic, underline, and link. Pasted URLs become links."}
        </Typography.Text>
      ) : null}

      <Modal
        title="Insert link"
        open={linkOpen}
        onOk={applyLink}
        onCancel={() => setLinkOpen(false)}
        okText="Add link"
        destroyOnClose
      >
        <Input
          autoFocus
          value={linkUrl}
          placeholder="https://example.com"
          onChange={(e) => setLinkUrl(e.target.value)}
          onPressEnter={applyLink}
        />
      </Modal>
    </div>
  );
}
