"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info, Loader2, LogOut, Settings } from "lucide-react";

import { DemoSidebar } from "./DemoSidebar";
import { ClientAppView } from "./ClientAppView";
import { DashboardView } from "./views/DashboardView";
import { ClientsView } from "./views/ClientsView";
import { ClientDetailView } from "./views/ClientDetailView";
import { ProgramsView } from "./views/ProgramsView";
import { ProgramDetailView } from "./views/ProgramDetailView";
import type { Client, DemoView, Program } from "./types";
import { makeId } from "./types";

const POLL_INTERVAL_MS = 4000;

export interface CurrentUser {
  id: string;
  name: string;
  role: "coach" | "client";
}

type CoachState = { role: "coach"; clients: Client[]; programs: Program[] };
type ClientState = { role: "client"; client: Client; program: Program | null; coachName: string };

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

export function ProductDemoApp({ currentUser }: { currentUser: CurrentUser }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<DemoView>({ name: "dashboard" });
  const [state, setState] = useState<CoachState | ClientState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api<CoachState | ClientState>("/api/demo/state");
        if (cancelled) return;
        setState(data);
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

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh();
  }

  async function assignProgram(clientId: string, programId: string | null) {
    setState((prev) =>
      prev?.role === "coach"
        ? { ...prev, clients: prev.clients.map((c) => (c.id === clientId ? { ...c, programId } : c)) }
        : prev
    );
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/assign-program`, {
        method: "POST",
        body: JSON.stringify({ programId }),
      });
      setState((prev) =>
        prev?.role === "coach"
          ? { ...prev, clients: prev.clients.map((c) => (c.id === clientId ? updated : c)) }
          : prev
      );
    } catch (err) {
      console.error("Failed to assign program:", err);
    }
  }

  async function createProgram(program: Program) {
    setState((prev) => (prev?.role === "coach" ? { ...prev, programs: [...prev.programs, program] } : prev));
    try {
      const created = await api<Program>("/api/demo/programs", {
        method: "POST",
        body: JSON.stringify(program),
      });
      setState((prev) =>
        prev?.role === "coach"
          ? { ...prev, programs: prev.programs.map((p) => (p.id === program.id ? created : p)) }
          : prev
      );
    } catch (err) {
      console.error("Failed to create program:", err);
    }
  }

  async function updateProgram(updated: Program) {
    setState((prev) =>
      prev?.role === "coach"
        ? { ...prev, programs: prev.programs.map((p) => (p.id === updated.id ? updated : p)) }
        : prev
    );
    try {
      const saved = await api<Program>(`/api/demo/programs/${updated.id}`, {
        method: "PATCH",
        body: JSON.stringify({ days: updated.days }),
      });
      setState((prev) =>
        prev?.role === "coach"
          ? { ...prev, programs: prev.programs.map((p) => (p.id === saved.id ? saved : p)) }
          : prev
      );
    } catch (err) {
      console.error("Failed to update program:", err);
    }
  }

  async function addClient(name: string): Promise<{ client: Client; inviteUrl: string }> {
    const result = await api<{ client: Client; inviteUrl: string }>("/api/demo/clients", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setState((prev) => (prev?.role === "coach" ? { ...prev, clients: [...prev.clients, result.client] } : prev));
    return result;
  }

  function applyClientUpdate(updated: Client) {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.role === "coach") {
        return { ...prev, clients: prev.clients.map((c) => (c.id === updated.id ? updated : c)) };
      }
      return prev.client.id === updated.id ? { ...prev, client: updated } : prev;
    });
  }

  async function logWeight(clientId: string, weight: number) {
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/weight`, {
        method: "POST",
        body: JSON.stringify({ weight }),
      });
      applyClientUpdate(updated);
    } catch (err) {
      console.error("Failed to log weight:", err);
    }
  }

  async function logWorkout(clientId: string, exerciseName: string, weight: number, reps: number) {
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/workout-log`, {
        method: "POST",
        body: JSON.stringify({ exerciseName, weight, reps }),
      });
      applyClientUpdate(updated);
    } catch (err) {
      console.error("Failed to log workout:", err);
    }
  }

  async function sendMessage(clientId: string, text: string) {
    const optimisticFrom = currentUser.role;
    const optimistic: Client["messages"][number] = {
      id: makeId(),
      from: optimisticFrom,
      text,
      at: new Date().toISOString(),
    };
    setState((prev) => {
      if (!prev) return prev;
      if (prev.role === "coach") {
        return {
          ...prev,
          clients: prev.clients.map((c) =>
            c.id === clientId ? { ...c, messages: [...c.messages, optimistic] } : c
          ),
        };
      }
      return prev.client.id === clientId
        ? { ...prev, client: { ...prev.client, messages: [...prev.client.messages, optimistic] } }
        : prev;
    });
    try {
      const updated = await api<Client>(`/api/demo/clients/${clientId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      applyClientUpdate(updated);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  if (!loaded || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your account…
        </div>
      </div>
    );
  }

  if (state.role === "client") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TopBar name={currentUser.name} role="client" onLogout={logout} />
        <div className="flex flex-1 justify-center overflow-y-auto bg-background p-6 sm:p-10">
          <ClientAppView
            client={state.client}
            program={state.program}
            coachName={state.coachName}
            onLogWeight={logWeight}
            onLogWorkout={logWorkout}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    );
  }

  let coachContent: ReactNode;
  if (view.name === "dashboard") {
    coachContent = (
      <DashboardView
        coachName={currentUser.name}
        clients={state.clients}
        programs={state.programs}
        onNavigate={setView}
      />
    );
  } else if (view.name === "clients") {
    coachContent = (
      <ClientsView
        clients={state.clients}
        programs={state.programs}
        onNavigate={setView}
        onAddClient={addClient}
      />
    );
  } else if (view.name === "client") {
    const client = state.clients.find((c) => c.id === view.id);
    coachContent = client ? (
      <ClientDetailView
        client={client}
        programs={state.programs}
        onNavigate={setView}
        onAssignProgram={assignProgram}
        onLogWeight={logWeight}
        onSendMessage={(text) => sendMessage(client.id, text)}
      />
    ) : (
      <p className="text-sm text-muted">Client not found.</p>
    );
  } else if (view.name === "programs") {
    coachContent = (
      <ProgramsView programs={state.programs} onNavigate={setView} onCreateProgram={createProgram} />
    );
  } else {
    const program = state.programs.find((p) => p.id === view.id);
    coachContent = program ? (
      <ProgramDetailView program={program} onNavigate={setView} onUpdateProgram={updateProgram} />
    ) : (
      <p className="text-sm text-muted">Program not found.</p>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar name={currentUser.name} role="coach" onLogout={logout} />
      <div className="flex flex-1">
        <DemoSidebar view={view} onNavigate={setView} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8">{coachContent}</div>
        </div>
      </div>
    </div>
  );
}

function TopBar({
  name,
  role,
  onLogout,
}: {
  name: string;
  role: "coach" | "client";
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-accent/10 px-6 py-2.5 text-xs text-accent-bright">
      <span className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Signed in as {name} ({role}) — this is your real account and real data.
      </span>
      <div className="flex items-center gap-2">
        <Link
          href="/account"
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:border-accent/40 hover:text-foreground"
        >
          <Settings className="h-3.5 w-3.5" /> Account
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:border-accent/40 hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Log out
        </button>
      </div>
    </div>
  );
}
