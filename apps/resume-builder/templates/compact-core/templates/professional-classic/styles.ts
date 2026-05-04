export const classicAcademicStyles = {
  wrapper:
    "border border-[var(--resume-border)] bg-[var(--resume-page-bg)] p-[var(--page-padding)] text-[var(--resume-text)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--resume-border)_50%,transparent)]",
  stack: "space-y-[max(12px,calc(var(--section-gap)*0.45))]",
  header: "space-y-2 border-y-2 border-[var(--resume-border)] py-3",
  section: "space-y-3 border-t border-[var(--resume-border)] pt-3",
  sectionTitle:
    "text-[11px] leading-[var(--resume-heading-leading)] font-bold uppercase tracking-[0.2em] text-[var(--resume-section-heading)]",
  bodyText:
    "text-sm leading-[var(--resume-body-leading)] text-[var(--resume-muted)]",
} as const;
