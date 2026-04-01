import Link from "next/link";

import { Card } from "@/components/ui/Card";

import type { RoadmapFeature } from "@/features/roadmap/services/roadmap-backend";

const FeatureDetailsContent = ({ feature }: { feature: RoadmapFeature }) => {
  const details = feature.details;

  if (!details) return null;

  const overview = feature.fullDescription ?? details.fullDescription;
  const whyItMatters = feature.whyItMatters ?? details.whyItMatters;
  const timeline = feature.timeline ?? details.timeline;

  return (
    <div className="mt-8 space-y-8">
      {overview && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Overview
          </h3>
          <p className="text-muted leading-relaxed">{overview}</p>
        </div>
      )}

      {whyItMatters && (
        <div className="border-border/50 rounded-2xl border bg-linear-to-br from-blue-500/5 to-purple-500/5 p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Why It Matters
          </h3>
          <p className="text-muted leading-relaxed">{whyItMatters}</p>
        </div>
      )}

      {details.problem && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Problem
          </h3>
          <p className="text-muted leading-relaxed">{details.problem}</p>
        </div>
      )}

      {details.solution && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Solution
          </h3>
          <p className="text-muted leading-relaxed">{details.solution}</p>
        </div>
      )}

      {details.approach && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Approach
          </h3>
          <p className="text-muted leading-relaxed">{details.approach}</p>
        </div>
      )}

      {details.keyImprovements && details.keyImprovements.length > 0 && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Key Improvements
          </h3>
          <ul className="text-muted list-disc space-y-2 pl-5">
            {details.keyImprovements.map((improvement, index) => (
              <li key={`${improvement}-${index}`}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {details.beforeAfter && details.beforeAfter.length > 0 && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Before vs After
          </h3>

          <div className="space-y-3">
            {details.beforeAfter.map((item, index) => (
              <div
                key={index}
                className="border-border/60 bg-card/40 rounded-xl border p-4"
              >
                <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                  Before
                </p>
                <p className="text-foreground mt-1 text-sm">{item.before}</p>
                <p className="text-muted mt-3 text-xs font-semibold tracking-wide uppercase">
                  After
                </p>
                <p className="text-foreground mt-1 text-sm">{item.after}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {details.technicalHighlights &&
        details.technicalHighlights.length > 0 && (
          <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
            <h3 className="text-foreground mb-3 text-lg font-semibold">
              Technical Highlights
            </h3>

            <ul className="text-muted list-disc space-y-2 pl-5">
              {details.technicalHighlights.map((highlight, index) => (
                <li key={`${highlight}-${index}`}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

      {details.items && details.items.length > 0 && (
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {feature.title === "7 Professional Templates"
              ? "Templates Included"
              : "Includes"}
          </h3>

          <div className="space-y-4">
            {details.items.map((item, idx) => (
              <Card key={idx}>
                {item.image && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <div
                      className="flex h-40 items-center justify-center bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 10px 10px",
                      }}
                    >
                      <p className="text-muted text-sm font-medium">
                        {item.name}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-foreground text-lg font-semibold">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-muted mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {details.media && details.media.length > 0 && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">Media</h3>

          <div className="space-y-3">
            {details.media.map((media, index) => (
              <div
                key={index}
                className="border-border/60 bg-card/40 rounded-xl border p-4"
              >
                {media.label && (
                  <p className="text-foreground text-sm font-semibold">
                    {media.label}
                  </p>
                )}
                {media.type && (
                  <p className="text-muted mt-1 text-xs tracking-wide uppercase">
                    {media.type}
                  </p>
                )}
                {media.url && (
                  <Link
                    href={media.url}
                    className="text-primary mt-2 inline-block text-sm underline-offset-2 hover:underline"
                  >
                    {media.url}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {details.impactMetrics && details.impactMetrics.length > 0 && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">Impact</h3>

          <ul className="text-muted list-disc space-y-2 pl-5">
            {details.impactMetrics.map((metric, index) => (
              <li key={`${metric}-${index}`}>{metric}</li>
            ))}
          </ul>
        </div>
      )}

      {timeline && (
        <div className="border-border/50 bg-card/30 rounded-2xl border p-6">
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Timeline
          </h3>

          <p className="text-muted">{timeline}</p>
        </div>
      )}
    </div>
  );
};

export default FeatureDetailsContent;
