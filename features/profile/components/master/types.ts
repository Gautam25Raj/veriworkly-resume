import type { MasterProfileData } from "@/types/resume";

export type RepeatableField =
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "languages"
  | "interests"
  | "awards"
  | "certificates"
  | "publications"
  | "volunteer"
  | "references"
  | "achievements"
  | "customSections";

type RepeatableItemMap = {
  [K in RepeatableField]: MasterProfileData[K][number];
};

export type UpdateRepeatableItem = <K extends RepeatableField>(
  field: K,
  id: string,
  updater: (item: RepeatableItemMap[K]) => RepeatableItemMap[K],
) => void;

export type AddRepeatableItem = <K extends RepeatableField>(
  field: K,
  item: RepeatableItemMap[K],
) => void;

export type RemoveRepeatableItem = (field: RepeatableField, id: string) => void;

export type UpdateProfile = (
  updater: (prev: MasterProfileData) => MasterProfileData,
) => void;
