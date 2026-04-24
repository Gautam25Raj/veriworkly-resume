import { Card } from "@/components/ui/Card";

const ProfileFeaturesInfo = () => {
  return (
    <Card className="space-y-4 p-6">
      <div className="border-border/40 space-y-1 border-b pb-4">
        <h2 className="text-foreground text-lg font-semibold">
          What each page does
        </h2>

        <p className="text-muted text-sm leading-6">
          The overview page explains the flow. The master page is for normal
          editing. The advanced page is for import/export and direct JSON.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border-border/60 bg-card/40 space-y-2 rounded-2xl border p-4">
          <p className="text-foreground text-sm font-semibold">Profile</p>
          <p className="text-muted text-sm leading-6">
            Edit your display name here. Email stays read-only. Verification,
            auto sync, and shared resume count are shown for quick reference.
          </p>
        </div>

        <div className="border-border/60 bg-card/40 space-y-2 rounded-2xl border p-4">
          <p className="text-foreground text-sm font-semibold">Master</p>
          <p className="text-muted text-sm leading-6">
            Full guided edit experience with visible sections, theme settings,
            and all resume content.
          </p>
        </div>

        <div className="border-border/60 bg-card/40 space-y-2 rounded-2xl border p-4">
          <p className="text-foreground text-sm font-semibold">Advanced</p>
          <p className="text-muted text-sm leading-6">
            Import/export JSON, restore backups, and make power-user changes.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileFeaturesInfo;
