import type {
  ResumeAdditionalItem,
  ResumeAdditionalSectionKind,
  ResumeCustomSection,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeLinkItem,
  ResumeLinkType,
  ResumeProjectItem,
  ResumeSkillGroup,
} from "@/types/resume";

function uniqueId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createExperienceItem(): ResumeExperienceItem {
  return {
    id: uniqueId("exp"),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    highlights: [],
  };
}

export function createEducationItem(): ResumeEducationItem {
  return {
    id: uniqueId("edu"),
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
  };
}

export function createProjectItem(): ResumeProjectItem {
  return {
    id: uniqueId("proj"),
    name: "",
    role: "",
    link: "",
    summary: "",
    highlights: [],
  };
}

export function createLinkItem(
  type: ResumeLinkType = "portfolio",
): ResumeLinkItem {
  return {
    id: uniqueId("link"),
    type,
    label: "",
    url: "",
  };
}

export function createSkillGroup(): ResumeSkillGroup {
  return {
    id: uniqueId("skills"),
    name: "New Skills",
    keywords: [],
  };
}

export function createCustomSection(
  preset?: Partial<Pick<ResumeCustomSection, "title" | "items">>,
): ResumeCustomSection {
  return {
    id: uniqueId("custom"),
    kind: "custom",
    title: preset?.title ?? "New Section",
    items: preset?.items?.length
      ? preset.items
      : [createAdditionalItem("custom")],
    editableTitle: true,
  };
}

export function createAdditionalItem(
  kind: ResumeAdditionalSectionKind,
): ResumeAdditionalItem {
  const base = {
    id: uniqueId(kind),
    issuer: "",
    date: "",
    link: "",
    referenceId: "",
    description: "",
    details: [],
  };

  if (kind === "certifications") {
    return {
      ...base,
      name: "New Certification",
    };
  }

  if (kind === "awards") {
    return {
      ...base,
      name: "New Award",
    };
  }

  if (kind === "publications") {
    return {
      ...base,
      name: "New Publication",
    };
  }

  if (kind === "languages") {
    return {
      ...base,
      name: "Language",
      referenceId: "Proficiency",
    };
  }

  if (kind === "interests") {
    return {
      ...base,
      name: "Interest",
    };
  }

  if (kind === "volunteer") {
    return {
      ...base,
      name: "Organization",
      issuer: "Role",
    };
  }

  if (kind === "references") {
    return {
      ...base,
      name: "Reference Name",
      issuer: "Title",
      referenceId: "Relationship",
    };
  }

  if (kind === "achievements") {
    return {
      ...base,
      name: "Achievement",
    };
  }

  return {
    ...base,
    name: "Custom Item",
  };
}
