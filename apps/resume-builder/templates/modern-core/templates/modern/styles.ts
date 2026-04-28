export const modernStyles = {
  wrapper:
    "rounded-[2rem] border border-[var(--resume-border)] bg-[var(--resume-page-bg)] p-[var(--page-padding)] text-[var(--resume-text)] shadow-[0_28px_90px_-48px_rgba(15,23,42,0.45)]",
  grid: "grid gap-8 lg:grid-cols-[1.7fr_1fr]",
  sidebar:
    "space-y-[max(16px,calc(var(--section-gap)-8px))] rounded-[1.5rem] border border-[var(--resume-border)] bg-[var(--resume-section-bg)] p-5",
  content: "space-y-[var(--section-gap)]",
} as const;
