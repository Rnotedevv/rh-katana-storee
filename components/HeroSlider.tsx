"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function HeroSlider() {
  const images = useMemo(() => ["/hero/1.png", "/hero/2.png", "/hero/3.png"], []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-black shadow-sm">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="RH Katana hero"
            fill
            className={`object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
            priority={i === 0}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

      <div className="relative p-6 md:p-10 text-white">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
          Handmade • Sharp • Premium Finish
        </p>

        <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
          Premium katana & swords crafted with blacksmith spirit.
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-white/80">
          Browse products below. If you want to order, click a product and contact via WhatsApp with auto message.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#products" className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-medium text-neutral-900 hover:opacity-90">
            View products
          </a>
          <a href="#contact" className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-center text-sm font-medium hover:bg-white/15">
            Contact
          </a>
        </div>

        <div className="mt-6 flex gap-2">
          {images.map((_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i === idx ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
