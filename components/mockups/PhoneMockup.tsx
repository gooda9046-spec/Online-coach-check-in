import type { ReactNode } from "react";

export function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[240px]">
      <div className="relative rounded-[2rem] border border-border bg-surface p-2 glow">
        <div className="absolute left-1/2 top-3 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-surface-2" />
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
          <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[10px] text-muted">
            <span>9:41</span>
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            </span>
          </div>
          <div className="min-h-[320px] px-3 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
