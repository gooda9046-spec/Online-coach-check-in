import { Calendar, Dumbbell, LayoutGrid, MessageSquare, Users } from "lucide-react";

const clients = [
  { name: "Maria Chen", plan: "Strength Block 4", progress: 82, status: "On track" },
  { name: "Jordan Lee", plan: "Marathon Prep", progress: 61, status: "On track" },
  { name: "Sam Okafor", plan: "Hypertrophy V2", progress: 35, status: "Needs check-in" },
];

const bars = [42, 68, 54, 80, 46, 90, 64];

export function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface glow">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-orange/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs text-muted">app.forgecoach.com/dashboard</span>
      </div>
      <div className="flex">
        <aside className="hidden w-14 flex-col items-center gap-5 border-r border-border py-6 sm:flex">
          <LayoutGrid className="h-5 w-5 text-accent-bright" />
          <Users className="h-5 w-5 text-muted" />
          <Dumbbell className="h-5 w-5 text-muted" />
          <Calendar className="h-5 w-5 text-muted" />
          <MessageSquare className="h-5 w-5 text-muted" />
        </aside>
        <div className="flex-1 p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Good morning, Coach Alex</p>
              <p className="text-xs text-muted">18 active clients · 3 need attention</p>
            </div>
            <div className="hidden rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white sm:block">
              + New Program
            </div>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <p className="text-xs text-muted">Revenue (MTD)</p>
              <p className="mt-1 text-lg font-bold text-foreground">$14,280</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <p className="text-xs text-muted">Adherence</p>
              <p className="mt-1 text-lg font-bold text-accent-bright">91%</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <p className="text-xs text-muted">Workouts logged</p>
              <p className="mt-1 text-lg font-bold text-foreground">1,204</p>
            </div>
          </div>

          <div className="mb-5 flex items-end gap-2 rounded-xl border border-border bg-surface-2 p-4">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-accent to-accent-bright"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="space-y-2">
            {clients.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-bright">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.plan}</p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    c.status === "On track" ? "text-emerald-400" : "text-orange"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
