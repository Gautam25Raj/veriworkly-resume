export const atsClassicStyles = {
  wrapper:
    "border border-[var(--resume-border)] bg-[var(--resume-page-bg)] p-[var(--page-padding)] text-[var(--resume-text)]",
  stack: "space-y-[max(8px,calc(var(--section-gap)*0.35))]",
  section: "space-y-2",
  sectionTitle:
    "border-b border-[var(--resume-border)] pb-1 text-xs leading-[var(--resume-heading-leading)] font-semibold uppercase tracking-[0.2em] text-[var(--resume-section-heading)]",
  bodyText:
    "text-sm leading-[var(--resume-body-leading)] text-[var(--resume-muted)]",
} as const;
