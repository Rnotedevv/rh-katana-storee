"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const imgs = useMemo(() => (images?.filter(Boolean).length ? images.filter(Boolean) : []), [images]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [imgs.length]);

  if (imgs.length === 0) return null;

  const prev = () => setIdx((v) => (v - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((v) => (v + 1) % imgs.length);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-100 border">
        {/* container pakai tinggi tetap biar portrait ga bikin layout jelek */}
        <div className="aspect-[4/3] md:aspect-[16/10] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgs[idx]}
            alt={name}
            className="h-full w-full object-contain p-2"
          />
        </div>

        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((u, i) => (
            <button
              key={u}
              onClick={() => setIdx(i)}
              className={`shrink-0 overflow-hidden rounded-2xl border ${i === idx ? "ring-2 ring-neutral-900" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-16 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
