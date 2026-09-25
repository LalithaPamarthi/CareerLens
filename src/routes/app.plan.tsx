import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { EmptyState } from "@/components/careerlens/EmptyState";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { SectionHeader } from "@/components/careerlens/SectionHeader";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/plan")({
  head: () => ({
    meta: [
      { title: "Career improvement roadmap — CareerLens" },
      {
        name: "description",
        content:
          "Follow a profile-grounded roadmap for this week, the next 30 days, and the next 60–90 days.",
      },
      { property: "og:title", content: "Career improvement roadmap — CareerLens" },
      {
        property: "og:description",
        content: "Prioritized actions based on your evidence gaps and target role.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});

const HORIZONS = [
  {
    key: "this-week" as const,
    title: "This week",
    note: "Quick fixes with immediate effect on how recruiters read you.",
  },
  {
    key: "30-days" as const,
    title: "Next 30 days",
    note: "Focused work that adds real evidence to your profile.",
  },
  {
    key: "60-90-days" as const,
    title: "60–90 days",
    note: "Deeper investments that change which roles you can target.",
  },
];

const PRIORITY_CLASS = {
  high: "bg-critical/10 text-critical",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
} as const;

function PlanPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const plan = analysis.improvementPlan;

  if (!plan.length) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Improvement plan" />
        <EmptyState
          icon={ListChecks}
          title="Nothing to plan yet"
          description="Add your resume, portfolio, GitHub or a target job to generate a prioritised plan."
          actionLabel="Analyze my profile"
          actionTo="/analyze"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Improvement plan"
        description="Ordered by impact on your weakest evidence — start at the top and work down."
      />

      {HORIZONS.map((horizon) => {
        const items = plan.filter((r) => r.horizon === horizon.key);
        if (!items.length) return null;
        return (
          <section key={horizon.key} className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold">{horizon.title}</h2>
              <p className="text-xs text-muted-foreground">{horizon.note}</p>
            </div>
            <ol className="space-y-3">
              {items.map((r, i) => (
                <li key={r.id} className="surface-card flex gap-4 p-5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{r.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_CLASS[r.priority]}`}
                      >
                        {r.priority} priority
                      </span>
                    </div>
                    <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-foreground">What is missing</dt>
                        <dd className="mt-0.5">{r.reason}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-foreground">What to do</dt>
                        <dd className="mt-0.5">{r.action}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-foreground">Expected hiring impact</dt>
                        <dd className="mt-0.5">{r.impact}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-foreground">Effort required</dt>
                        <dd className="mt-0.5">{r.effort}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
