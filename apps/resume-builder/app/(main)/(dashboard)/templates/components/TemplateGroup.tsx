import TemplateCard from "../components/TemplateCard";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  previewImage: string;
  family: string;
  layout: string;
  tags: string[];
}

interface TemplateGroupProps {
  group: {
    title: string;
    items: TemplateItem[];
  };
}

const TemplateGroup = ({ group }: TemplateGroupProps) => {
  return (
    <section className="space-y-5">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        {group.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {group.items.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
};

export default TemplateGroup;
