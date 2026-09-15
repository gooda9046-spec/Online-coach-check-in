import type { Client, DemoView, Program } from "../types";

export function ClientsView({
  clients,
  programs,
  onNavigate,
}: {
  clients: Client[];
  programs: Program[];
  onNavigate: (view: DemoView) => void;
}) {
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Clients</h1>
      <p className="mb-6 text-sm text-muted">Click a client to view their program and adjust it.</p>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Program</th>
              <th className="px-4 py-3 font-medium">Adherence</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                onClick={() => onNavigate({ name: "client", id: client.id })}
                className="cursor-pointer border-b border-border last:border-none hover:bg-surface-2"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-bright">
                      {client.initials}
                    </div>
                    <span className="font-medium text-foreground">{client.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {programs.find((p) => p.id === client.programId)?.name ?? "No program assigned"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-border">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-bright"
                        style={{ width: `${client.adherence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">{client.adherence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${
                      client.status === "On track" ? "text-emerald-400" : "text-orange"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
