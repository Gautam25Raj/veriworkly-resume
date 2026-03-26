import { structuredProfessionalStyles } from "../styles";

export function SectionHeading({ title }: { title: string }) {
  return <h2 className={structuredProfessionalStyles.sectionTitle}>{title}</h2>;
}
