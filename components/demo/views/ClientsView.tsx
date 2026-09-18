"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, Plus } from "lucide-react";

import type { Client, DemoView, Program } from "../types";

export function ClientsView({
  clients,
  programs,
  onNavigate,
  onAddClient,
}: {
  clients: Client[];
  programs: Program[];
  onNavigate: (view: DemoView) => void;
  onAddClient: (name: string) => Promise<{ client: Client; inviteUrl: string }>;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justInvited, setJustInvited] = useState<{ name: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const { client, inviteUrl } = await onAddClient(trimmed);
      setJustInvited({ name: client.name, url: inviteUrl });
      setName("");
      setAdding(false);
    } catch (err) {
      console.error("Failed to add client:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted">Click a client to view their program and adjust it.</p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => {
              setJustInvited(null);
              setAdding(true);
            }}
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-bright"
          >
            <Plus className="h-4 w-4" /> Add Client
          </button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={submit}
          className="mb-6 flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client's full name"
            className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-bright disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create & Get Invite Link"}
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground"
          >
            Cancel
          </button>
        </form>
      )}

      {justInvited && (
        <div className="mb-6 rounded-xl border border-accent/40 bg-accent/10 p-4">
          <p className="text-sm font-semibold text-foreground">
            {justInvited.name} added — send them this link
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              readOnly
              value={justInvited.url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(justInvited.url).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-bright"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No clients yet — add your first one to get an invite link you can send them.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Adherence</th>
                <th className="px-4 py-3 font-medium">Account</th>
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
                        client.userId ? "text-emerald-400" : "text-orange"
                      }`}
                    >
                      {client.userId ? "Joined" : "Invite pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
