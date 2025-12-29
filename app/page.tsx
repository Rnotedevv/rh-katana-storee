import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export const revalidate = 0;


type Product = {
  id: string;
  name: string;
  slug: string;
  price_usd: number;
  discount_percent: number;
  description: string;
  image_url: string;
};

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
function discounted(price: number, percent: number) {
  return Math.max(0, price * (1 - (percent || 0) / 100));
}

export default async function Home() {
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,price_usd,discount_percent,description,image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <HeroSlider />
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-6xl px-5 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-neutral-600">{products.length} item(s)</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const finalPrice = discounted(p.price_usd, p.discount_percent);

            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group rounded-3xl border bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md active:translate-y-0"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{p.description}</p>
                  </div>

                  {p.discount_percent > 0 && (
                    <span className="shrink-0 rounded-full bg-neutral-900 px-2 py-1 text-xs text-white shadow-sm">
                      -{p.discount_percent}%
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-base font-semibold">{formatUSD(finalPrice)}</p>
                  {p.discount_percent > 0 && (
                    <p className="text-sm text-neutral-500 line-through">{formatUSD(p.price_usd)}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-white/70">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="text-xl font-semibold">Help / FAQ</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Common questions about shipping, payment, and ordering.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Shipping worldwide?",
                a: "Yes. We can ship worldwide. Carriers available: UPS and DHL.",
              },
              {
                q: "Payment methods",
                a: "We accept Western Union (WU) and PayPal.",
              },
              {
                q: "How to order?",
                a: "Open a product page and click Contact via WhatsApp. The message will be auto-filled.",
              },
              {
                q: "Custom requests",
                a: "For custom builds, contact us via WhatsApp or Instagram and tell us the specification you want.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
              >
                <p className="font-medium">{item.q}</p>
                <p className="mt-2 text-sm text-neutral-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
