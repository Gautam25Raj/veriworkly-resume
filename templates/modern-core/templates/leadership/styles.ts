export const executiveStyles = {
  wrapper:
    "rounded-[1rem] border border-[var(--resume-border)] bg-[var(--resume-page-bg)] p-0 overflow-hidden shadow-xl",
  container: "flex min-h-[1100px]",
  sidebar:
    "w-[32%] bg-[var(--resume-section-bg)] py-8 px-4 border-r border-[var(--resume-border)] space-y-[max(10px,calc(var(--section-gap)-8px))]",
  main: "flex-1 p-10 space-y-8 bg-[var(--resume-page-bg)]",
  sectionTitle:
    "text-sm font-bold tracking-widest uppercase border-b-2 border-[var(--accent)] pb-1 mb-4",
} as const;
