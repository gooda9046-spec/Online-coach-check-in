"use client";

import { useRef, useState, type FormEvent } from "react";
import { Camera, Loader2, X } from "lucide-react";

import type { GeneralEntry, Program } from "./types";
import { usePhotoUpload } from "./usePhotoUpload";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function AddEntryForm({ onAdd }: { onAdd: (notes: string, photoUrl: string | null) => Promise<void> }) {
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = usePhotoUpload();

  function pickPhoto(file: File) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!notes.trim() && !photoFile) return;
    setSubmitting(true);
    let photoUrl: string | null = null;
    if (photoFile) {
      photoUrl = await upload(photoFile);
      if (!photoUrl) {
        setSubmitting(false);
        return;
      }
    }
    await onAdd(notes.trim(), photoUrl);
    setNotes("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setSubmitting(false);
  }

  return (
    <form onSubmit={submit} className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add a note…"
        rows={3}
        className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted"
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {photoPreview && (
        <div className="relative mt-2 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoPreview} alt="" className="h-20 w-20 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => {
              setPhotoFile(null);
              setPhotoPreview(null);
            }}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-muted hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-medium text-accent-bright hover:underline"
        >
          <Camera className="h-3.5 w-3.5" /> {photoFile ? "Change photo" : "Add photo"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) pickPhoto(file);
          }}
        />
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-bright disabled:opacity-50"
        >
          {(submitting || uploading) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Post
        </button>
      </div>
    </form>
  );
}

export function GeneralProgramFeed({
  program,
  onAddEntry,
}: {
  program: Program;
  onAddEntry: (notes: string, photoUrl: string | null) => Promise<void>;
}) {
  const entries = [...program.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <AddEntryForm onAdd={onAddEntry} />
      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          Nothing here yet — add the first note or photo above.
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry: GeneralEntry) => (
            <li key={entry.id} className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted">{formatDate(entry.date)}</span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                  {entry.addedBy}
                </span>
              </div>
              {entry.notes && <p className="text-sm text-foreground">{entry.notes}</p>}
              {entry.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.photoUrl}
                  alt=""
                  className="mt-3 max-h-72 w-full rounded-lg object-cover"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
