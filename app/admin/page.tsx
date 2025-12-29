"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  price_usd: number;
  discount_percent: number;
  description: string;
  image_url: string;
  image_urls: string[];
  is_active: boolean;
  created_at?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatUSD(n: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // form fields
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slugManual, setSlugManual] = useState(""); // bisa diedit kalau mau
  const autoSlug = useMemo(() => slugify(name || ""), [name]);
  const slug = (slugManual || autoSlug).trim();

  const [price, setPrice] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // images
  const [files, setFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // untuk edit
  const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => {
      // cleanup object URLs
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setSessionReady(true);
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setMsg(null);
    const { data, error } = await supabase
      .from("products")
      .select("id,name,slug,price_usd,discount_percent,description,image_url,image_urls,is_active,created_at")
      .order("created_at", { ascending: false });

    if (error) setMsg(error.message);
    setProducts((data ?? []) as Product[]);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setSlugManual("");
    setPrice("0");
    setDiscount("0");
    setDescription("");
    setIsActive(true);
    setFiles([]);
    setExistingImageUrls([]);
  }

  async function uploadMany(selected: File[], productSlug: string) {
    const urls: string[] = [];

    for (const f of selected) {
      const ext = f.name.split(".").pop() || "jpg";
      const rand = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)).replace(/-/g, "");
      const path = `${Date.now()}-${productSlug}-${rand}.${ext}`;

      const up = await supabase.storage.from("products").upload(path, f, { upsert: false });
      if (up.error) throw up.error;

      const pub = supabase.storage.from("products").getPublicUrl(path);
      urls.push(pub.data.publicUrl);
    }

    return urls;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!name.trim()) return setMsg("Product name required.");
    if (!slug) return setMsg("Slug invalid.");
    if (!editingId && files.length === 0) return setMsg("Choose at least 1 image.");

    setBusy(true);
    try {
      let image_urls = [...existingImageUrls];

      // jika user pilih file baru, upload & replace images
      if (files.length > 0) {
        const uploaded = await uploadMany(files, slug);
        image_urls = uploaded;
      }

      const payload = {
        name: name.trim(),
        slug,
        price_usd: Number(price),
        discount_percent: Number(discount),
        description,
        image_url: image_urls[0] ?? "",
        image_urls,
        is_active: isActive,
      };

      if (!payload.image_url) throw new Error("Image upload failed / empty image_url.");

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        setMsg("✅ Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        setMsg("✅ Product created!");
      }

      resetForm();
      await refresh();
    } catch (err: any) {
      setMsg(err?.message || "Failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onEdit(p: Product) {
    setMsg(null);
    setEditingId(p.id);
    setName(p.name);
    setSlugManual(p.slug);
    setPrice(String(p.price_usd ?? 0));
    setDiscount(String(p.discount_percent ?? 0));
    setDescription(p.description ?? "");
    setIsActive(Boolean(p.is_active));
    setFiles([]);
    setExistingImageUrls((p.image_urls && p.image_urls.length > 0) ? p.image_urls : (p.image_url ? [p.image_url] : []));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setBusy(false);
    if (error) setMsg(error.message);
    await refresh();
  }

  async function onToggleActive(p: Product) {
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    setBusy(false);
    if (error) setMsg(error.message);
    await refresh();
  }

  if (!sessionReady) return <div className="p-6 text-sm">Checking session...</div>;

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm text-neutral-600">Admin</p>
            <h1 className="text-lg font-semibold">RH KATANA STORE</h1>
          </div>
          <button
            onClick={signOut}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-2">
        {/* Form */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? "Edit product" : "Add product"}</h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border px-3 py-2 text-xs hover:bg-neutral-50"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <input
              className="w-full rounded-2xl border px-4 py-3 text-sm"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                placeholder="Slug (auto)"
                value={autoSlug}
                readOnly
              />
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                placeholder="Slug override (optional)"
                value={slugManual}
                onChange={(e) => setSlugManual(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                placeholder="Price (USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                placeholder="Discount %"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <textarea
              className="w-full rounded-2xl border px-4 py-3 text-sm"
              placeholder="Description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span>Active (visible on public store)</span>
            </label>

            <div className="rounded-2xl border bg-neutral-50 p-4">
              <p className="text-sm font-medium">Product images</p>
              <p className="mt-1 text-xs text-neutral-600">
                Upload multiple photos (gallery). First image will be the main thumbnail.
              </p>

              {existingImageUrls.length > 0 && files.length === 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {existingImageUrls.slice(0, 6).map((u) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={u} src={u} className="aspect-square w-full rounded-xl object-cover" alt="existing" />
                  ))}
                </div>
              )}

              {previewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {previewUrls.slice(0, 6).map((u) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={u} src={u} className="aspect-square w-full rounded-xl object-cover" alt="preview" />
                  ))}
                </div>
              )}

              <input
                className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />

              <p className="mt-2 text-xs text-neutral-600">
                {files.length > 0
                  ? `${files.length} file(s) selected. (Will replace existing gallery on save)`
                  : editingId
                  ? "No new file selected (keep existing gallery)."
                  : "Select at least 1 image for new product."}
              </p>
            </div>

            <button
              disabled={busy}
              className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Saving..." : editingId ? "Update product" : "Create product"}
            </button>
          </form>

          {msg && <p className="mt-3 text-sm">{msg}</p>}
        </div>

        {/* List */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Products</h2>

          <div className="mt-4 space-y-3">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {p.name}{" "}
                      {!p.is_active && <span className="text-xs text-neutral-500">(inactive)</span>}
                    </p>
                    <p className="truncate text-xs text-neutral-600">/{p.slug}</p>
                    <p className="mt-1 text-xs text-neutral-700">
                      {formatUSD(Number(p.price_usd))}{" "}
                      {Number(p.discount_percent) > 0 && (
                        <span className="text-neutral-500">(-{p.discount_percent}%)</span>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-xl border px-3 py-2 text-xs hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleActive(p)}
                      className="rounded-xl border px-3 py-2 text-xs hover:bg-neutral-50"
                    >
                      {p.is_active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="rounded-xl border px-3 py-2 text-xs hover:bg-neutral-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* thumb */}
                {(p.image_url || (p.image_urls && p.image_urls[0])) && (
                  <div className="mt-3 overflow-hidden rounded-2xl bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url || p.image_urls[0]}
                      alt={p.name}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            {products.length === 0 && <p className="text-sm text-neutral-600">No products yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
