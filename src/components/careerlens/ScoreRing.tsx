import { cn } from "@/lib/utils";

interface ScoreRingProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  className?: string;
}

/** Accessible SVG score ring — no chart library needed for a single value. */
export function ScoreRing({ value, size = 132, thickness = 10, label, className }: ScoreRingProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("inline-flex flex-col items-center justify-center gap-2", className)}
      role="img"
      aria-label={`${label ?? "Score"}: ${clamped} out of 100`}
    >
      <div
        className="relative grid shrink-0 place-items-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="stroke-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <span className="relative text-3xl font-semibold tracking-tight tabular-nums leading-none">
          {clamped}
        </span>
      </div>
      {label ? (
        <span className="max-w-36 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}
