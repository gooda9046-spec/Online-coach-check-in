"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import type { Message } from "./types";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function MessageThread({
  messages,
  viewerRole,
  onSend,
  placeholder = "Type a message…",
  className = "",
}: {
  messages: Message[];
  viewerRole: "coach" | "client";
  onSend: (text: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="py-6 text-center text-xs text-muted">No messages yet.</p>
        )}
        {messages.map((m) => {
          const mine = m.from === viewerRole;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "rounded-br-sm bg-accent text-white"
                    : "rounded-bl-sm bg-surface-2 text-foreground"
                }`}
              >
                {m.text}
              </div>
              <span className="mt-0.5 px-1 text-[10px] text-muted">{formatTime(m.at)}</span>
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-2.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-border bg-surface-2 px-3.5 py-2 text-sm text-foreground placeholder:text-muted"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-bright"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
