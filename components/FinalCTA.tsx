import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Stop stitching together tools. <br className="hidden sm:block" />
            Start running your <span className="text-gradient">coaching business</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Join 10,000+ coaches who program, manage, and get paid — all from
            Forge.
          </p>
          <div className="mt-9">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted">
            No credit card required · 14-day free trial
          </p>
        </Reveal>
      </div>
    </section>
  );
}
