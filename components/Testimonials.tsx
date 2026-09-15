import { Star } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const testimonials = [
  {
    quote:
      "I went from juggling four apps and a spreadsheet to running my entire business from Forge. I got back almost six hours a week I now spend actually coaching.",
    name: "Danielle Ruiz",
    role: "Online Strength Coach, 62 clients",
  },
  {
    quote:
      "The client app is the reason my retention jumped. People actually open it every day because it feels less like homework and more like a habit tracker they like using.",
    name: "Marcus Webb",
    role: "Founder, Ironline Performance",
  },
  {
    quote:
      "Bulk assigning programs and automated onboarding alone paid for the subscription in the first month. Everything else is a bonus at this point.",
    name: "Priya Shah",
    role: "Head Coach, Studio Forma",
  },
];

const stats = [
  { value: "10,000+", label: "Coaches on Forge" },
  { value: "500,000+", label: "Workouts logged" },
  { value: "2.1M+", label: "Habits checked off" },
  { value: "$40M+", label: "Processed in payments" },
];

export function Testimonials() {
  return (
    <section className="border-t border-border bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by coaches who take their business seriously
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-orange text-orange" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-surface p-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-gradient sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
