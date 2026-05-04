import type { ReactNode } from "react";

interface FullScreenMessageProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const FullScreenMessage = ({
  icon,
  title,
  action,
  description,
}: FullScreenMessageProps) => {
  return (
    <div className="bg-background surface-grid flex min-h-screen flex-col items-center justify-center space-y-6 p-6 text-center">
      {icon ? (
        <div className="bg-card border-border rounded-2xl border p-4 md:rounded-3xl md:p-6">
          {icon}
        </div>
      ) : null}

      <div className="space-y-2">
        <h1 className="text-foreground text-2xl font-black tracking-tighter md:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="text-muted max-w-sm text-xs font-medium md:text-sm">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
};

export { FullScreenMessage };
