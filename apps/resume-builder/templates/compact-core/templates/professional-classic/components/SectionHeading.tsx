import { classicAcademicStyles } from "../styles";

export function SectionHeading({ title }: { title: string }) {
  return <h2 className={classicAcademicStyles.sectionTitle}>{title}</h2>;
}
