"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Info, Loader2 } from "lucide-react";

import { DemoSidebar } from "./DemoSidebar";
import { ClientAppView } from "./ClientAppView";
import { DashboardView } from "./views/DashboardView";
import { ClientsView } from "./views/ClientsView";
import { ClientDetailView } from "./views/ClientDetailView";
import { ProgramsView } from "./views/ProgramsView";
import { ProgramDetailView } from "./views/ProgramDetailView";
import type { Client, DemoPerspective, DemoView, Program } from "./types";
import { makeId } from "./types";

const POLL_INTERVAL_MS = 4000;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `${path} failed (${res.status})`);
  }
  return res.json();
}

export function ProductDemoApp() {
  const [loaded, setLoaded] = useState(false);
  const [perspective, setPerspective] = useState<DemoPerspective>("coach");
  const [view, setView] = useState<DemoView>({ name: "dashboard" });
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeClientId, setActiveClientId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const state = await api<{ clients: Client[]; programs: Program[] }>("/api/demo/state");
        if (cancelled) return;
        setClients(state.clients);
        setPrograms(state.programs);
        setActiveClientId((prev) => prev || state.clients[0]?.id || "");
        setLoaded(true);
      } catch (err) {
        console.error("Failed to load demo state:", err);
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function assignProgram(clientId: string, programId: string | null) {
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, programId } : c)));
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/assign-program`, {
        method: "POST",
        body: JSON.stringify({ programId }),
      });
      setClients((prev) => prev.map((c) => (c.id === clientId ? updated : c)));
    } catch (err) {
      console.error("Failed to assign program:", err);
    }
  }

  async function createProgram(program: Program) {
    setPrograms((prev) => [...prev, program]);
    try {
      const created = await api<Program>("/api/demo/programs", {
        method: "POST",
        body: JSON.stringify(program),
      });
      setPrograms((prev) => prev.map((p) => (p.id === program.id ? created : p)));
    } catch (err) {
      console.error("Failed to create program:", err);
    }
  }

  async function updateProgram(updated: Program) {
    setPrograms((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    try {
      const saved = await api<Program>(`/api/demo/programs/${updated.id}`, {
        method: "PATCH",
        body: JSON.stringify({ days: updated.days }),
      });
      setPrograms((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } catch (err) {
      console.error("Failed to update program:", err);
    }
  }

  async function logWeight(clientId: string, weight: number) {
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/weight`, {
        method: "POST",
        body: JSON.stringify({ weight }),
      });
      setClients((prev) => prev.map((c) => (c.id === clientId ? updated : c)));
    } catch (err) {
      console.error("Failed to log weight:", err);
    }
  }

  async function sendMessage(clientId: string, from: "client" | "coach", text: string) {
    const optimistic: Client["messages"][number] = {
      id: makeId(),
      from,
      text,
      at: new Date().toISOString(),
    };
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, messages: [...c.messages, optimistic] } : c))
    );
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/messages`, {
        method: "POST",
        body: JSON.stringify({ from, text }),
      });
      setClients((prev) => prev.map((c) => (c.id === clientId ? updated : c)));
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading demo…
        </div>
      </div>
    );
  }

  const activeClient = clients.find((c) => c.id === activeClientId) ?? clients[0];
  const activeClientProgram = activeClient
    ? programs.find((p) => p.id === activeClient.programId) ?? null
    : null;

  let coachContent: ReactNode;
  if (view.name === "dashboard") {
    coachContent = <DashboardView clients={clients} programs={programs} onNavigate={setView} />;
  } else if (view.name === "clients") {
    coachContent = <ClientsView clients={clients} programs={programs} onNavigate={setView} />;
  } else if (view.name === "client") {
    const client = clients.find((c) => c.id === view.id);
    coachContent = client ? (
      <ClientDetailView
        client={client}
        programs={programs}
        onNavigate={setView}
        onAssignProgram={assignProgram}
        onLogWeight={logWeight}
        onSendMessage={(text) => sendMessage(client.id, "coach", text)}
      />
    ) : (
      <p className="text-sm text-muted">Client not found.</p>
    );
  } else if (view.name === "programs") {
    coachContent = (
      <ProgramsView programs={programs} onNavigate={setView} onCreateProgram={createProgram} />
    );
  } else {
    const program = programs.find((p) => p.id === view.id);
    coachContent = program ? (
      <ProgramDetailView program={program} onNavigate={setView} onUpdateProgram={updateProgram} />
    ) : (
      <p className="text-sm text-muted">Program not found.</p>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-accent/10 px-6 py-2.5 text-xs text-accent-bright">
        <span className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Live beta — changes here are real and shared with anyone else viewing this link.
        </span>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setPerspective("coach")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                perspective === "coach" ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              Coach view
            </button>
            <button
              type="button"
              onClick={() => setPerspective("client")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                perspective === "client" ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
            >
              Client view
            </button>
          </div>
          {perspective === "client" && activeClient && (
            <select
              value={activeClient.id}
              onChange={(e) => setActiveClientId(e.target.value)}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  Viewing as {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {perspective === "coach" ? (
        <div className="flex flex-1">
          <DemoSidebar view={view} onNavigate={setView} />
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 sm:p-8">{coachContent}</div>
          </div>
        </div>
      ) : activeClient ? (
        <div className="flex flex-1 justify-center overflow-y-auto bg-background p-6 sm:p-10">
          <ClientAppView
            client={activeClient}
            program={activeClientProgram}
            onLogWeight={logWeight}
            onSendMessage={(clientId, text) => sendMessage(clientId, "client", text)}
          />
        </div>
      ) : null}
    </div>
  );
}
