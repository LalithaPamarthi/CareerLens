import { ArrowRight, Check, CircleDashed, FileText, Github, Layers3 } from "lucide-react";
import { LevelBadge } from "./SeverityBadge";
import type { SkillEvidence, SkillGap } from "@/lib/types";

const SOURCE_GROUPS = [
  { label: "Resume", icon: FileText, matches: ["resume", "skills list"] },
  { label: "Portfolio", icon: Layers3, matches: ["portfolio", "project"] },
  { label: "GitHub", icon: Github, matches: ["github"] },
] as const;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function findAction(item: SkillEvidence, gaps: SkillGap[]) {
  const skill = normalize(item.skill);
  const match = gaps.find((gap) => {
    const gapSkill = normalize(gap.skill);
    return gapSkill === skill || gapSkill.includes(skill) || skill.includes(gapSkill);
  });
  if (match) return match.action;
  if (item.level === "strong")
    return `Keep ${item.skill} visible and explain one decision or outcome that proves depth.`;
  if (item.level === "partial")
    return `Add ${item.skill} to a second source with a specific project, decision, or result.`;
  return `Create one documented piece of work using ${item.skill}, then link it from your profile.`;
}

function gapText(item: SkillEvidence) {
  if (item.level === "strong") return "No critical evidence gap detected.";
  if (item.level === "partial") return "Only one source supports this claim.";
  return "No supporting evidence was found.";
}

export function EvidenceTriangulation({
  evidence,
  gaps,
  limit,
}: {
  evidence: SkillEvidence[];
  gaps: SkillGap[];
  limit?: number;
}) {
  const ordered = [...evidence].sort((a, b) => {
    const rank = { missing: 0, partial: 1, strong: 2 } as const;
    return rank[a.level] - rank[b.level] || Number(b.required) - Number(a.required);
  });
  const visible = typeof limit === "number" ? ordered.slice(0, limit) : ordered;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="hidden grid-cols-[minmax(8rem,.8fr)_minmax(15rem,1.25fr)_minmax(10rem,.8fr)_minmax(15rem,1.35fr)] gap-4 border-b border-border bg-muted/45 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
        <span>Claim</span>
        <span>Evidence found</span>
        <span>Gap</span>
        <span>Recommended action</span>
      </div>
      <ul className="divide-y divide-border">
        {visible.map((item) => (
          <li
            key={`${item.skill}-${item.required ? "required" : "preferred"}`}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(8rem,.8fr)_minmax(15rem,1.25fr)_minmax(10rem,.8fr)_minmax(15rem,1.35fr)]"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                Claim
              </p>
              <p className="mt-1 text-sm font-semibold lg:mt-0">{item.skill}</p>
              <LevelBadge level={item.level} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                Evidence found
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1.5 lg:mt-0">
                {SOURCE_GROUPS.map((source) => {
                  const found = item.sources.some((value) =>
                    source.matches.some((match) => value.toLowerCase().includes(match)),
                  );
                  const Icon = source.icon;
                  return (
                    <span
                      key={source.label}
                      className={`flex min-w-0 flex-col items-center gap-1 rounded-md border px-2 py-2 text-[11px] font-medium ${
                        found
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-border bg-muted/35 text-muted-foreground"
                      }`}
                    >
                      {found ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                      <span className="truncate">{source.label}</span>
                    </span>
                  );
                })}
              </div>
              {item.sources.length ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Found in: {item.sources.join(" · ")}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                Gap
              </p>
              <p className="mt-1 flex gap-2 text-sm leading-relaxed text-muted-foreground lg:mt-0">
                <CircleDashed className="mt-0.5 size-4 shrink-0" /> {gapText(item)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                Recommended action
              </p>
              <p className="mt-1 flex gap-2 text-sm leading-relaxed lg:mt-0">
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />{" "}
                {findAction(item, gaps)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
