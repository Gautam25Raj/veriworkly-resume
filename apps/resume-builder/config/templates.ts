import { templateRegistry } from "@/templates";

export const templateSummaries = templateRegistry.map((template) => ({
  id: template.id,
  name: template.name,
  description: template.description,
  accentColor: template.accentColor,
  previewImage: template.previewImage,
  tags: template.tags,
}));
