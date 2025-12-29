import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20">
      {/* accent line biar ga polos */}
      <div className="h-[2px] w-full bg-gradient-to-r from-neutral-900/0 via-amber-500/40 to-neutral-900/0" />

      <div className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          {/* left: logo + title */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border bg-white shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <Image src="/logo.png" alt="RH KATANA STORE logo" fill className="object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">RH KATANA STORE</p>
              <p className="flex items-center gap-2 text-xs text-neutral-600">
                BLACKSMITH INDONESIA
                <Image
                  src="/flags/id.png"
                  alt="Indonesia"
                  width={18}
                  height={12}
                  className="rounded-[3px] shadow-sm"
                />
              </p>
            </div>
          </Link>

          {/* nav */}
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {[
              { label: "Products", href: "/#products" },
              { label: "Help / FAQ", href: "/#faq" },
              { label: "Contact", href: "/#contact" },
              { label: "Dashboard", href: "/admin" }, // sesuai request kamu
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-neutral-700 transition hover:-translate-y-[1px] hover:bg-neutral-900/5 hover:text-neutral-900 hover:shadow-sm active:translate-y-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/#products"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
          >
            Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
