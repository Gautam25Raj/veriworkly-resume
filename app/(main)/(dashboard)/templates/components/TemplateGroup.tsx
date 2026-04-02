import TemplateCard from "../components/TemplateCard";

const TemplateGroup = ({ group }: any) => {
  return (
    <section className="space-y-5">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        {group.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {group.items.map((template: any) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
};

export default TemplateGroup;
