"use client";

import { useEffect, useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";

import type { ProgressPhoto } from "./types";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Coach-only gallery — fetches straight from the coach-only endpoint, so
 * there's no client-visible path this data ever travels through. */
export function ProgressPhotos({ clientId }: { clientId: string }) {
  const [photos, setPhotos] = useState<ProgressPhoto[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/demo/clients/${clientId}/photos`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPhotos(data.photos ?? []);
      })
      .catch(() => {
        if (!cancelled) setPhotos([]);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  if (photos === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading photos…
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        <ImageOff className="h-5 w-5" />
        No progress photos yet — they&apos;ll show up here once your client sends one.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {photos.map((photo) => (
        <a
          key={photo.id}
          href={photo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-square overflow-hidden rounded-lg border border-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.caption ?? `Progress photo from ${formatDate(photo.date)}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1 text-[10px] text-white">
            {formatDate(photo.date)}
          </span>
        </a>
      ))}
    </div>
  );
}
