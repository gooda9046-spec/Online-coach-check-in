import type { ReactNode } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  narrow = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-bright">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description && <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{description}</p>}
          </div>
        </section>
        <div
          className={`mx-auto px-4 py-14 sm:px-6 lg:px-8 ${narrow ? "max-w-2xl" : "max-w-4xl"}`}
        >
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
