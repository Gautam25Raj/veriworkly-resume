import type {
  ResumeBasics,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeProjectItem,
  ResumeSkillGroup,
} from "@/types/resume";

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

const datePattern = /^\d{4}-(0[1-9]|1[0-2])$/;

function isValidDate(value: string) {
  return !value || datePattern.test(value);
}

function isValidUrl(value: string) {
  return !value || /^https?:\/\/.+/i.test(value);
}

export function validateBasics(
  basics: ResumeBasics,
): ValidationErrors<
  "fullName" | "role" | "headline" | "email" | "phone" | "location"
> {
  const errors: ValidationErrors<
    "fullName" | "role" | "headline" | "email" | "phone" | "location"
  > = {};

  if (!basics.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!basics.headline.trim()) {
    errors.headline = "Headline is required.";
  }

  if (!basics.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!basics.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!basics.phone.trim()) {
    errors.phone = "Phone is required.";
  }

  if (!basics.location.trim()) {
    errors.location = "Location is required.";
  }

  return errors;
}

export function validateSummary(summary: string): ValidationErrors<"summary"> {
  const errors: ValidationErrors<"summary"> = {};

  if (!summary.trim()) {
    errors.summary = "Summary is required.";
  } else if (summary.trim().length < 30) {
    errors.summary = "Summary should be at least 30 characters.";
  }

  return errors;
}

export function validateExperience(
  item: ResumeExperienceItem,
): ValidationErrors<
  "role" | "company" | "location" | "startDate" | "endDate" | "summary"
> {
  const errors: ValidationErrors<
    "role" | "company" | "location" | "startDate" | "endDate" | "summary"
  > = {};

  if (!item.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!item.company.trim()) {
    errors.company = "Company is required.";
  }

  if (!item.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!isValidDate(item.startDate)) {
    errors.startDate = "Use YYYY-MM format.";
  }

  const hasPresentEndDate = item.endDate.trim().toLowerCase() === "present";

  if (!isValidDate(item.endDate) && !item.current && !hasPresentEndDate) {
    errors.endDate = "Use YYYY-MM format.";
  }

  if (!item.summary.trim()) {
    errors.summary = "Summary is required.";
  }

  return errors;
}

export function validateEducation(
  item: ResumeEducationItem,
): ValidationErrors<"school" | "degree" | "field" | "startDate" | "endDate"> {
  const errors: ValidationErrors<
    "school" | "degree" | "field" | "startDate" | "endDate"
  > = {};

  if (!item.school.trim()) {
    errors.school = "School is required.";
  }

  if (!item.degree.trim()) {
    errors.degree = "Degree is required.";
  }

  if (!item.field.trim()) {
    errors.field = "Field is required.";
  }

  if (!isValidDate(item.startDate)) {
    errors.startDate = "Use YYYY-MM format.";
  }

  if (!isValidDate(item.endDate) && !item.current) {
    errors.endDate = "Use YYYY-MM format.";
  }

  return errors;
}

export function validateProject(
  item: ResumeProjectItem,
): ValidationErrors<"name" | "role" | "link" | "summary"> {
  const errors: ValidationErrors<"name" | "role" | "link" | "summary"> = {};

  if (!item.name.trim()) {
    errors.name = "Project name is required.";
  }

  if (!item.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!isValidUrl(item.link)) {
    errors.link = "Use a valid URL starting with http:// or https://";
  }

  if (!item.summary.trim()) {
    errors.summary = "Summary is required.";
  }

  return errors;
}

export function validateSkillGroup(
  item: ResumeSkillGroup,
): ValidationErrors<"name" | "keywords"> {
  const errors: ValidationErrors<"name" | "keywords"> = {};

  if (!item.name.trim()) {
    errors.name = "Group name is required.";
  }

  if (!item.keywords.length) {
    errors.keywords = "Add at least one skill.";
  }

  return errors;
}
