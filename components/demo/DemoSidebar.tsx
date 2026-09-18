import Link from "next/link";
import { Dumbbell, Flame, LayoutGrid, Users2 } from "lucide-react";

import type { DemoView } from "./types";

const items = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "clients", label: "Clients", icon: Users2 },
  { key: "programs", label: "Programs", icon: Dumbbell },
] as const;

export function DemoSidebar({
  view,
  onNavigate,
}: {
  view: DemoView;
  onNavigate: (view: DemoView) => void;
}) {
  const activeKey = view.name === "client" ? "clients" : view.name === "program" ? "programs" : view.name;

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
      <Link href="/" className="flex items-center gap-2 px-5 py-5 font-bold text-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
          <Flame className="h-4 w-4 text-white" aria-hidden />
        </span>
        Forge
      </Link>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate({ name: item.key } as DemoView)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              activeKey === item.key
                ? "bg-accent/15 text-accent-bright"
                : "text-muted hover:bg-surface-2 hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
