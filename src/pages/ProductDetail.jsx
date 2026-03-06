import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { STORE_ID } from "../config/store";
import { useCartStore } from "../store/cart.store";
import toast from "react-hot-toast";

/* ---------- SKELETON ---------- */
function SkeletonDetail() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-stone-950 via-stone-950 to-stone-900 text-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
              {/* ✅ Use aspect ratio instead of h-105 */}
              <div className="aspect-4/5 bg-white/10" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-full rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
              <div className="h-7 w-3/4 rounded bg-white/10" />
              <div className="mt-4 h-4 w-1/2 rounded bg-white/10" />

              <div className="mt-5 h-4 w-full rounded bg-white/10" />
              <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
              <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />

              <div className="mt-6 h-10 w-32 rounded bg-white/10" />
              <div className="mt-6 h-12 w-full rounded-2xl bg-white/10" />
              <div className="mt-3 h-12 w-full rounded-2xl bg-white/10" />

              <div className="mt-6 h-28 w-full rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL UI BITS ---------- */
function StarRow({ rating = 4.6, count = 312 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <span
              key={i}
              className={filled ? "text-amber-300" : "text-stone-700"}
            >
              ★
            </span>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-stone-100">{rating}</span>
      <span className="text-sm text-stone-400">({count} reviews)</span>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      {items.map((it, idx) => (
        <div key={it.title}>
          <button
            type="button"
            onClick={() => setOpen(open === idx ? -1 : idx)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-semibold text-white">{it.title}</span>
            <span className="text-amber-300">{open === idx ? "−" : "+"}</span>
          </button>
          {open === idx ? (
            <div className="px-5 pb-5 text-sm leading-6 text-stone-200/80">
              {it.content}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [pincode, setPincode] = useState("");
  const [pinMsg, setPinMsg] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    let alive = true;

    const fetchProduct = async () => {
      setLoading(true);
      setErr("");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("store_id", STORE_ID)
        .single();

      if (!alive) return;

      if (error) {
        setErr(error.message || "Failed to load product.");
        setProduct(null);
      } else {
        setProduct(data);
        setSelectedVariant(null);
      }

      setLoading(false);
    };

    fetchProduct();
    return () => {
      alive = false;
    };
  }, [id]);

  const cartItem = items.find((it) => it.productId === product?.id);
  const qtyInCart = cartItem?.quantity ?? 0;

  const price = useMemo(() => {
    const p = selectedVariant?.price ?? product?.base_price ?? 0;
    return Number(p);
  }, [selectedVariant, product]);

  const handleAddToCart = () => {
    if (product?.is_active === false) return;

    addItem({
      productId: product.id,
      storeId: STORE_ID,
      title: product.title,
      price,
    });

    toast.success(
      qtyInCart > 0
        ? `Updated cart • ${qtyInCart + 1} in cart`
        : "Added to cart",
    );
  };

  const handleCheckPincode = () => {
    const ok = /^\d{6}$/.test(pincode.trim());
    setPinMsg(
      ok
        ? "✅ Delivery available • Estimated 2–5 days • Free shipping above ₹999"
        : "Enter a valid 6-digit pincode",
    );
  };

  if (loading) return <SkeletonDetail />;

  if (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
          {err}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            🗂️
          </div>
          <h2 className="text-lg font-semibold text-white">
            Product not found
          </h2>
          <p className="mt-1 text-sm text-stone-300">
            This item may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  const inStock = product?.is_active !== false;

  const typeLabel = product?.type || "Stationery";
  const categoryLabel = product?.category || "Essentials";

  return (
    <div className="min-h-[70vh] bg-linear-to-b from-stone-950 via-stone-950 to-stone-900 text-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* BREADCRUMB */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-400">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <span className="text-stone-700">/</span>
          <Link to="/products" className="hover:text-white">
            Products
          </Link>
          <span className="text-stone-700">/</span>
          <span className="font-semibold text-white line-clamp-1">
            {product.title}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT: IMAGE */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur">
              <div className="relative group">
                <div className="relative aspect-4/5 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                    loading="lazy"
                  />

                  {/* overlays */}
                  <div className="pointer-events-none absolute inset-0 bg-black/30" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-950/70 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-amber-500/15 via-transparent to-yellow-500/10" />

                  {/* badge */}
                  {product?.badge ? (
                    <span className="absolute left-4 top-4 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-semibold text-stone-950 shadow">
                      {product.badge}
                    </span>
                  ) : null}

                  {/* overlay chips */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-stone-100 backdrop-blur">
                        ✨ Premium finish
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-stone-100 backdrop-blur">
                        📦 Gift-ready packing
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-stone-100 backdrop-blur">
                        ✅ Quality checked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS STRIP */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { t: "Authentic quality", d: "Curated daily essentials" },
                { t: "Fast dispatch", d: "Packed within 24–48 hrs" },
                { t: "Secure packing", d: "Neat & protective wrap" },
              ].map((b) => (
                <div
                  key={b.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="text-sm font-semibold text-white">{b.t}</div>
                  <div className="mt-1 text-xs text-stone-300">{b.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: BUY BOX */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {product.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-stone-200">
                        Type:{" "}
                        <span className="text-amber-300">{typeLabel}</span>
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-stone-200">
                        Category:{" "}
                        <span className="text-amber-300">{categoryLabel}</span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      inStock
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-white/10 bg-white/5 text-stone-400",
                    ].join(" ")}
                  >
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <StarRow rating={4.6} count={312} />
                  <span className="text-xs font-semibold text-amber-300">
                    Trusted choice
                  </span>
                </div>

                {product?.short_description ? (
                  <p className="mt-3 text-sm text-stone-200/80">
                    {product.short_description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-stone-200/80">
                    Everyday stationery essential—designed for smooth writing,
                    neat organization, and long-lasting use.
                  </p>
                )}

                {/* PRICE */}
                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <div className="text-3xl font-extrabold text-white">
                    ₹{price}
                  </div>

                  {product?.mrp ? (
                    <div className="pb-1 text-sm text-stone-500 line-through">
                      ₹{Number(product.mrp)}
                    </div>
                  ) : (
                    <div className="pb-1 text-sm text-stone-300">
                      Taxes as applicable
                    </div>
                  )}

                  <span className="pb-1 text-sm font-semibold text-amber-300">
                    {product?.mrp ? "Deal price" : "Best price"}
                  </span>
                </div>

                {/* PINCODE */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-white">
                    Check delivery
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter pincode"
                      className="w-full rounded-2xl border border-white/10 bg-stone-950/40 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/15"
                    />
                    <button
                      type="button"
                      onClick={handleCheckPincode}
                      className="shrink-0 rounded-2xl bg-[#d4af37] px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-300"
                    >
                      Check
                    </button>
                  </div>
                  {pinMsg ? (
                    <p className="mt-2 text-xs text-stone-200/80">{pinMsg}</p>
                  ) : (
                    <p className="mt-2 text-xs text-stone-300">
                      COD may be available • Easy returns
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={[
                      "w-full rounded-2xl px-6 py-3.5 text-sm font-semibold transition",
                      "focus:outline-none focus:ring-4",
                      !inStock
                        ? "cursor-not-allowed bg-white/10 text-stone-500"
                        : "bg-[#d4af37] text-stone-950 hover:bg-amber-300 focus:ring-amber-500/20",
                    ].join(" ")}
                  >
                    {!inStock
                      ? "Out of stock"
                      : qtyInCart > 0
                        ? `In cart: ${qtyInCart} • Add more`
                        : "Add to cart"}
                  </button>

                  <Link
                    to="/cart"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-stone-100 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
                  >
                    Go to cart
                  </Link>
                </div>

                {/* OFFERS */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-white">
                    Offers for you
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-stone-200/80">
                    <li className="flex gap-2">
                      <span>🏷️</span> Bundle deals on select items (dummy)
                    </li>
                    <li className="flex gap-2">
                      <span>🎁</span> Gift-ready packaging available
                    </li>
                    <li className="flex gap-2">
                      <span>🚚</span> Free shipping above ₹999 (dummy)
                    </li>
                  </ul>
                </div>
              </div>

              {/* DESCRIPTION + INFO */}
              <div className="mt-6">
                <Accordion
                  items={[
                    {
                      title: "Description",
                      content: product.description ? (
                        <p className="whitespace-pre-line">
                          {product.description}
                        </p>
                      ) : (
                        <p>
                          A premium stationery essential built for daily
                          comfort, neat results, and dependable performance.
                        </p>
                      ),
                    },
                    {
                      title: "Specifications",
                      content: (
                        <ul className="list-disc pl-5">
                          <li>Type: {typeLabel}</li>
                          <li>Category: {categoryLabel}</li>
                          <li>Item: {product?.title}</li>
                          <li>Quality: Checked (dummy)</li>
                        </ul>
                      ),
                    },
                    {
                      title: "Package & Care",
                      content: (
                        <ul className="list-disc pl-5">
                          <li>Protective packaging to avoid damage</li>
                          <li>Labelled to reduce mix-ups</li>
                          <li>Store in a cool, dry place</li>
                        </ul>
                      ),
                    },
                    {
                      title: "Shipping & Returns",
                      content: (
                        <ul className="list-disc pl-5">
                          <li>Dispatch: within 24–48 hours (dummy)</li>
                          <li>Delivery: 2–5 business days (dummy)</li>
                          <li>Returns: As per store policy</li>
                        </ul>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOT TRUST */}
        <div className="mt-10 flex flex-wrap gap-2 text-xs text-stone-300">
          {[
            "🔒 Secure payments",
            "🚚 Fast dispatch",
            "🎁 Gift-ready packing",
            "✅ Quality checked",
          ].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
