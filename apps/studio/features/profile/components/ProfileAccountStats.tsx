import { AccountProfile } from "../services/account-profile";

const AccountStatsPanel = ({ profile }: { profile: AccountProfile | null }) => {
  const stats = [
    ["API keys", (profile?._count?.apiKeys ?? 0).toString()],
    ["Share links", (profile?._count?.shareLinks ?? 0).toString()],
    ["Documents", (profile?._count?.resumes ?? 0).toString()],
  ];

  return (
    <aside
      className="border-border bg-card rounded-2xl border p-4"
      aria-labelledby="profile-stats-title"
    >
      <h2 id="profile-stats-title" className="text-sm font-black">
        Account stats
      </h2>

      <div className="mt-4 space-y-3">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="bg-muted/20 flex items-center justify-between gap-3 rounded-xl px-3 py-2"
          >
            <span className="text-muted text-xs">{label}</span>
            <span className="truncate text-xs font-bold">{value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AccountStatsPanel;
