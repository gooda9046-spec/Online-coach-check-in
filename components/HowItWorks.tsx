import { ClipboardList, CreditCard, MessageSquareText, UserPlus2 } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const steps = [
  {
    icon: ClipboardList,
    title: "Set up your programs",
    description:
      "Build your workout templates, nutrition plans, and habit checklists once — reuse them across your whole roster.",
  },
  {
    icon: UserPlus2,
    title: "Onboard clients",
    description:
      "Send an automated intake flow that collects goals, equipment, and health history before their first session.",
  },
  {
    icon: MessageSquareText,
    title: "Clients train, log, and message",
    description:
      "Clients open the app, follow their plan, log meals and workouts, and message you directly when they need you.",
  },
  {
    icon: CreditCard,
    title: "Track progress and get paid",
    description:
      "Watch adherence and results roll in on your dashboard while recurring billing runs quietly in the background.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-bright">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From setup to paid, in four steps
          </h2>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="relative flex flex-col items-start">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-background">
                  <step.icon className="h-5 w-5 text-accent-bright" aria-hidden />
                </div>
                <p className="mt-4 text-xs font-semibold text-accent-bright">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
