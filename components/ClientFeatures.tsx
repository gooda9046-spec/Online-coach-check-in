import { Activity, MessageCircle, Sun, Watch } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { PhoneMockup } from "@/components/mockups/PhoneMockup";

const features = [
  {
    icon: Sun,
    title: "Today Tab",
    description: "One adaptive view of everything a client needs to do today.",
    bullets: [
      "Today's workout, tasks, and habits in one feed",
      "Live steps and calorie totals pulled in automatically",
      "Adapts daily based on recovery and adherence",
    ],
    screen: (
      <div className="pt-2">
        <p className="mb-3 text-xs font-semibold text-foreground">Today, Wed Sep 16</p>
        <div className="space-y-2">
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-2.5">
            <p className="text-[11px] font-semibold text-foreground">Push Day — Upper Body</p>
            <p className="text-[10px] text-muted">6 exercises · ~50 min</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-2.5">
            <span className="text-[11px] text-foreground">Log bodyweight</span>
            <span className="h-3.5 w-3.5 rounded-full border border-muted" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-2.5">
            <span className="text-[11px] text-foreground">Drink 3L water</span>
            <span className="text-[10px] text-accent-bright">2.1L</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-lg bg-surface-2 p-2 text-center">
              <p className="text-xs font-bold text-foreground">8,240</p>
              <p className="text-[9px] text-muted">Steps</p>
            </div>
            <div className="rounded-lg bg-surface-2 p-2 text-center">
              <p className="text-xs font-bold text-foreground">2,150</p>
              <p className="text-[9px] text-muted">Calories</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Watch,
    title: "Tracking & Syncing",
    description: "Every meal and metric logged, synced from wherever it lives.",
    bullets: [
      "Fast food journal with barcode and photo logging",
      "Auto-sync with Apple Health, Google Fit, and Wear OS",
      "Weight, sleep, and HRV trends charted automatically",
    ],
    screen: (
      <div className="pt-2">
        <p className="mb-3 text-xs font-semibold text-foreground">Synced devices</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 p-2.5">
            <Watch className="h-3.5 w-3.5 text-accent-bright" />
            <span className="text-[11px] text-foreground">Wear OS</span>
            <span className="ml-auto text-[10px] text-emerald-400">Connected</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 p-2.5">
            <Activity className="h-3.5 w-3.5 text-accent-bright" />
            <span className="text-[11px] text-foreground">Apple Health</span>
            <span className="ml-auto text-[10px] text-emerald-400">Connected</span>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-2.5">
            <p className="mb-1 text-[10px] text-muted">Grilled chicken bowl</p>
            <p className="text-[11px] font-semibold text-foreground">520 kcal · 46g protein</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description: "Stay close to clients without leaving the app.",
    bullets: [
      "In-app inbox for direct 1:1 messaging",
      "Share form-check videos with timestamped notes",
      "Group chats to build community around your program",
    ],
    screen: (
      <div className="flex h-full flex-col justify-end pt-2">
        <div className="space-y-2">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-[11px] text-white">
            Form check on today&apos;s squats 🎥
          </div>
          <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface-2 px-3 py-2 text-[11px] text-foreground">
            Great depth! Brace a bit harder out of the hole.
          </div>
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-[11px] text-white">
            On it, thanks Coach 💪
          </div>
        </div>
      </div>
    ),
  },
];

export function ClientFeatures() {
  return (
    <section className="border-t border-border bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-bright">
            For Clients
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Core features for clients
          </h2>
          <p className="mt-4 text-lg text-muted">
            A companion app your clients will actually want to open — so they
            stay consistent and you stay in the loop.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center text-center">
                <PhoneMockup>{feature.screen}</PhoneMockup>
                <div className="mt-6 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
                  <feature.icon className="h-4 w-4 text-accent-bright" aria-hidden />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm text-muted">{feature.description}</p>
                <ul className="mt-4 space-y-1.5 text-left">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
