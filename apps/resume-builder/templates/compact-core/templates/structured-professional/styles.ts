export const structuredProfessionalStyles = {
  wrapper:
    "border border-[var(--resume-border)] bg-[var(--resume-page-bg)] px-[var(--page-padding)] py-[var(--page-padding)] text-(--resume-text)",
  stack: "space-y-[max(14px,calc(var(--section-gap)*0.5))]",
  header: "space-y-2 border-b-2 border-(--resume-border) pb-4",
  section: "space-y-2 border-l-2 border-(--resume-border) pl-4",
  sectionTitle:
    "text-[11px] leading-(--resume-heading-leading) font-semibold uppercase tracking-[0.16em] text-(--resume-section-heading)",
  bodyText: "text-sm leading-(--resume-body-leading) text-(--resume-muted)",
  metaText: "text-xs leading-(--resume-body-leading) text-(--resume-muted)",
} as const;
