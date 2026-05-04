import type { ResumeData } from "@/types/resume";
import type { CSSProperties, ReactNode } from "react";

import { RESUME_FONT_FAMILY_MAP } from "@/features/resume/constants/resume-fonts";

interface BaseShellProps {
  customization: ResumeData["customization"];
  children: ReactNode;
  className?: string;
}

export function BaseShell({
  customization,
  children,
  className,
}: BaseShellProps) {
  const templateStyle = {
    borderColor: customization.borderColor,
    color: customization.textColor,
    fontFamily: RESUME_FONT_FAMILY_MAP[customization.fontFamily],
    "--accent": customization.accentColor,
    "--resume-text": customization.textColor,
    "--resume-muted": customization.mutedTextColor,
    "--resume-page-bg": customization.pageBackgroundColor,
    "--resume-section-bg": customization.sectionBackgroundColor,
    "--resume-border": customization.borderColor,
    "--resume-section-heading": customization.sectionHeadingColor,
    "--section-gap": `${customization.sectionSpacing}px`,
    "--page-padding": `${customization.pagePadding}px`,
    "--resume-body-leading": customization.bodyLineHeight,
    "--resume-heading-leading": customization.headingLineHeight,
  } as CSSProperties;

  return (
    <div style={templateStyle} className={className}>
      {children}
    </div>
  );
}
