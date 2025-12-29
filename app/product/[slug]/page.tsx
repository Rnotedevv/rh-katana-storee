export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductGallery from "@/components/ProductGallery";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export const revalidate = 0;


type Params = { slug: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  price_usd: number;
  discount_percent: number;
  description: string;
  image_url: string;
  image_urls: string[] | null;
  is_active: boolean;
  created_at?: string;
};

function formatUSD(n: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}
function discounted(price: number, percent: number) {
  return Math.max(0, price * (1 - (percent || 0) / 100));
}

export default async function ProductPage({ params }: { params: Params | Promise<Params> }) {
  const { slug } = await params;

  const { data: p, error } = await supabase
    .from("products")
    .select("id,name,slug,price_usd,discount_percent,description,image_url,image_urls,is_active,created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-white p-6">
        <pre className="rounded-2xl border bg-neutral-50 p-4 text-sm">{error.message}</pre>
      </main>
    );
  }

  if (!p) {
    return (
      <main className="min-h-screen bg-white">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-5 py-10">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-600">Product not found.</p>
            <p className="mt-2 text-sm">
              <Link className="underline" href="/#products">
                Back to products
              </Link>
            </p>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  const images = (p.image_urls?.length ? p.image_urls : [p.image_url]).filter(Boolean);

  const finalPrice = discounted(Number(p.price_usd), Number(p.discount_percent));
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const msg = `Hi brother, I'm interested in the product *${p.name}*.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  // More products (selain yang sedang dibuka)
  const { data: moreData } = await supabase
    .from("products")
    .select("id,name,slug,price_usd,discount_percent,description,image_url,is_active,created_at")
    .eq("is_active", true)
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(6);

  const more = (moreData ?? []) as Omit<Product, "image_urls">[];

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        {/* breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-neutral-600">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            <span className="px-2">/</span>
            <Link href="/#products" className="hover:underline">
              Products
            </Link>{" "}
            <span className="px-2">/</span>
            <span className="text-neutral-900">{p.name}</span>
          </div>

          <Link
            href="/#products"
            className="rounded-xl border bg-white/80 px-3 py-2 text-sm shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
          >
            ← Back
          </Link>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={images} name={p.name} />

          {/* Info */}
          <div className="space-y-5">
            <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
              <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>

              <div className="mt-3 flex items-baseline gap-3">
                <p className="text-2xl font-semibold">{formatUSD(finalPrice)}</p>

                {Number(p.discount_percent) > 0 && (
                  <>
                    <p className="text-sm text-neutral-500 line-through">{formatUSD(Number(p.price_usd))}</p>
                    <span className="rounded-full bg-neutral-900 px-2 py-1 text-xs text-white shadow-sm">
                      -{p.discount_percent}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {p.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                >
                  Contact via WhatsApp
                </a>

                <Link
                  href="/#faq"
                  className="inline-flex items-center justify-center rounded-2xl border bg-white px-5 py-3 text-sm font-medium text-neutral-900 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                >
                  Help / FAQ
                </Link>
              </div>

              <div className="mt-6 rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-700">
                <p className="font-medium">Shipping & Payment</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Shipping worldwide via <b>UPS</b> / <b>DHL</b>. Payment: <b>WU</b> & <b>PayPal</b>.
                </p>
              </div>
            </div>

            {/* small trust row */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border bg-white/80 p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
                <p className="text-sm font-medium">Handmade & Premium Finish</p>
                <p className="mt-1 text-sm text-neutral-600">Crafted with blacksmith spirit.</p>
              </div>
              <div className="rounded-3xl border bg-white/80 p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
                <p className="text-sm font-medium">Fast Response</p>
                <p className="mt-1 text-sm text-neutral-600">Contact via WhatsApp / Instagram.</p>
              </div>
            </div>
          </div>
        </div>

        {/* More products */}
        {more.length > 0 && (
          <div className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-semibold">More products</h2>
              <Link className="text-sm text-neutral-600 hover:underline" href="/#products">
                View all
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((x) => {
                const fp = discounted(Number(x.price_usd), Number(x.discount_percent));
                return (
                  <Link
                    key={x.id}
                    href={`/product/${x.slug}`}
                    className="group rounded-3xl border bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={x.image_url}
                        alt={x.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{x.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{x.description}</p>
                      </div>

                      {Number(x.discount_percent) > 0 && (
                        <span className="shrink-0 rounded-full bg-neutral-900 px-2 py-1 text-xs text-white shadow-sm">
                          -{x.discount_percent}%
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-base font-semibold">{formatUSD(fp)}</p>
                      {Number(x.discount_percent) > 0 && (
                        <p className="text-sm text-neutral-500 line-through">{formatUSD(Number(x.price_usd))}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
