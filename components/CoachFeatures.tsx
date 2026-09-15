import { CalendarClock, CreditCard, Dumbbell, Sparkles, Users2, BarChart3, ListChecks, UserPlus } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const features = [
  {
    icon: Dumbbell,
    title: "Workout Programming",
    description: "Build precise programs fast, or let AI draft the first pass.",
    bullets: [
      "Drag-and-drop custom program builder",
      "AI-assisted routine generation from your templates",
      "Auto-progression for sets, reps, and load",
    ],
    mockup: (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
          <span className="text-xs font-medium text-foreground">Back Squat</span>
          <span className="text-xs text-accent-bright">4×6 @ 78%</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
          <span className="text-xs font-medium text-foreground">Romanian Deadlift</span>
          <span className="text-xs text-accent-bright">3×8 @ 65%</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-bright" /> AI suggestion ready
          </span>
          <span className="text-xs text-accent-bright">Review</span>
        </div>
      </div>
    ),
  },
  {
    icon: Users2,
    title: "Client Management",
    description: "See every client's status at a glance and act in bulk.",
    bullets: [
      "Multi-client dashboard with adherence flags",
      "Bulk program and template assignment",
      "Automated onboarding forms and intake flows",
    ],
    mockup: (
      <div className="space-y-2">
        {[
          { name: "18 clients selected", icon: UserPlus },
          { name: "Assign “Hypertrophy V2”", icon: ListChecks },
        ].map((row) => (
          <div
            key={row.name}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-xs font-medium text-foreground"
          >
            <row.icon className="h-3.5 w-3.5 text-accent-bright" />
            {row.name}
          </div>
        ))}
        <div className="rounded-lg bg-accent px-3 py-2 text-center text-xs font-semibold text-white">
          Apply to Group
        </div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "Nutrition & Habits",
    description: "Coach the full lifestyle, not just the workout.",
    bullets: [
      "Flexible meal plans with swappable foods",
      "Macro and calorie tracking synced to logs",
      "Daily habit goals — water, steps, sleep, and more",
    ],
    mockup: (
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Protein", value: "142g", pct: 78 },
          { label: "Carbs", value: "210g", pct: 60 },
          { label: "Fat", value: "58g", pct: 45 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-surface-2 p-2.5">
            <div className="mx-auto mb-1.5 h-1.5 w-full rounded-full bg-border">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-bright"
                style={{ width: `${m.pct}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted">{m.label}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: "Business Tools",
    description: "The back office runs itself so you can coach.",
    bullets: [
      "Integrated payments and recurring billing",
      "Built-in scheduling for calls and check-ins",
      "Progress analytics across your whole roster",
    ],
    mockup: (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <CreditCard className="h-3.5 w-3.5 text-accent-bright" /> Monthly billing
          </span>
          <span className="text-xs text-emerald-400">Active</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <CalendarClock className="h-3.5 w-3.5 text-accent-bright" /> Check-in, Tue 4:00pm
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <BarChart3 className="h-3.5 w-3.5 text-accent-bright" /> Roster adherence
          </span>
          <span className="text-xs text-accent-bright">91%</span>
        </div>
      </div>
    ),
  },
];

export function CoachFeatures() {
  return (
    <section id="features" className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-bright">
            For Coaches
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Core features for coaches
          </h2>
          <p className="mt-4 text-lg text-muted">
            Everything you need to program, manage, and grow your coaching
            business — without stitching together five different tools.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                  <feature.icon className="h-5 w-5 text-accent-bright" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
                <ul className="mt-4 space-y-2">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl border border-border bg-background p-4">
                  {feature.mockup}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
