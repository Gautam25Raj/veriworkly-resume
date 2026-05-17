"use client";

import { Path, Svg } from "@react-pdf/renderer";

import type { ResumeLinkType } from "@/types/resume";

import { SOCIAL_ICON_PATH_BY_TYPE } from "../shared/social-icons";

export function PdfSocialIcon({
  color,
  size,
  type,
}: {
  color: string;
  size: number;
  type: ResumeLinkType;
}) {
  const icon = SOCIAL_ICON_PATH_BY_TYPE[type] || SOCIAL_ICON_PATH_BY_TYPE.custom;

  return (
    <Svg height={size} viewBox={icon.viewBox} width={size}>
      <Path d={icon.path} fill={color} />
    </Svg>
  );
}
