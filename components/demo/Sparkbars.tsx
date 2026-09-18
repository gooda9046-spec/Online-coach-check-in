export interface SparkPoint {
  id: string;
  label: string;
  value: number;
  tooltip?: string;
}

/** A small bar-chart row + label row underneath, scaled between the set's
 * own min/max. Used for weight check-ins and exercise progression alike. */
export function Sparkbars({ points, highlightId }: { points: SparkPoint[]; highlightId?: string }) {
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return (
    <div>
      <div className="flex h-16 gap-1.5">
        {points.map((point) => {
          const heightPct = ((point.value - min) / range) * 70 + 30;
          const isHighlighted = point.id === highlightId;
          return (
            <div key={point.id} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                className={`w-full rounded-t-sm ${isHighlighted ? "bg-accent-bright" : "bg-border"}`}
                style={{ height: `${heightPct}%` }}
                title={point.tooltip}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {points.map((point) => (
          <span key={point.id} className="flex-1 text-center text-[10px] text-muted">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
