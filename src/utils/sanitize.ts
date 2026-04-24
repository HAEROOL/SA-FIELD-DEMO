import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "del",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
  "hr", "div", "span",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "class", "style",
  "target", "rel", "width", "height",
  "data-text-align",
];

const ALLOWED_URI_REGEXP =
  /^(?:https?|mailto):/i;

export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") return dirty;

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    FORCE_BODY: false,
  });
}
