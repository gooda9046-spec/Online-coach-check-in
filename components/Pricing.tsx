import Link from "next/link";
import { Check } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    description: "For coaches just getting started with online clients.",
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    features: [
      "Up to 10 active clients",
      "Workout & nutrition programming",
      "Client mobile app access",
      "Basic progress analytics",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    description: "For growing coaching businesses ready to scale.",
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    features: [
      "Up to 75 active clients",
      "AI-assisted program generation",
      "Automated onboarding flows",
      "Integrated payments & billing",
      "Wearable & health app sync",
      "Priority chat support",
    ],
    highlighted: true,
  },
  {
    name: "Studio / Team",
    price: "$199",
    period: "/mo",
    description: "For multi-coach studios and performance teams.",
    cta: "Talk to Sales",
    href: "/contact-sales",
    features: [
      "Unlimited active clients",
      "Multi-coach seats & permissions",
      "Team-wide analytics dashboard",
      "White-labeled client app",
      "Dedicated onboarding specialist",
      "24/7 priority support",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-bright">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple pricing that scales with your roster
          </h2>
          <p className="mt-4 text-lg text-muted">
            Every plan includes the full client app experience. Upgrade as
            your client list grows.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-8",
                  tier.highlighted
                    ? "border-accent bg-surface glow lg:-translate-y-3"
                    : "border-border bg-surface"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>
                  {tier.highlighted && <Badge variant="accent">Most Popular</Badge>}
                </div>
                <p className="mt-2 text-sm text-muted">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted">{tier.period}</span>
                </p>

                <Button
                  className="mt-6 w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>

                <ul className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                      {feature}
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
