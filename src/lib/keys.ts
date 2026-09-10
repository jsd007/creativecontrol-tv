function isField(el: HTMLElement | null) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
}

function elementFrom(target: EventTarget | null) {
  return target instanceof HTMLElement ? target : null;
}

function activeElement() {
  return typeof document !== "undefined" && document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
}

/** True when a key should type, not drive the show / lens. Checks the event target and focus. */
export function isTypingTarget(target: EventTarget | null) {
  return isField(elementFrom(target)) || isField(activeElement());
}

const ACTION =
  "a, button, summary, input, textarea, select, [role='button'], [role='tab'], [role='option'], [role='menuitem'], [contenteditable='true']";

function isControl(el: HTMLElement | null) {
  return Boolean(el?.closest(ACTION));
}

/** Focused door, toggle, rail, or field — Space / Enter belong to it. */
export function isActionTarget(target: EventTarget | null) {
  return isControl(elementFrom(target)) || isControl(activeElement());
}

/** Space on a link takes the door instead of scrolling. */
export function activateOnSpace(e: { key: string; preventDefault: () => void; currentTarget: EventTarget }) {
  if (e.key !== " ") return;
  e.preventDefault();
  if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
}
