import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    accentColor: string;
    tags: string[];
  };
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card className="hover:border-accent/40 flex flex-col justify-between space-y-6 transition-colors">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              {template.name}
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              {template.description}
            </p>
          </div>
          <span
            className="h-3 w-16 shrink-0 rounded-full"
            style={{ backgroundColor: template.accentColor }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <Link
        className="text-accent hover:text-accent/80 w-fit text-sm font-medium transition-colors"
        href={`/templates/${template.id}`}
      >
        Open preview →
      </Link>
    </Card>
  );
};

export default TemplateCard;
