import { atsClassicStyles } from "../styles";

export function SectionHeading({ title }: { title: string }) {
  return <h2 className={atsClassicStyles.sectionTitle}>{title}</h2>;
}
