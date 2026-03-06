import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* ---------- DATA (STATIONERY) ---------- */

const HERO_BANNERS = [
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1800&auto=format&fit=crop",
];

const TYPE_DATA = [
  { type: "Pen" },
  { type: "Notebook" },
  { type: "Paper" },
  { type: "Art Supply" },
  { type: "Book" },
  { type: "Office Tool" },
  { type: "Accessory" },
  { type: "Adhesive" },
  { type: "Kit" },
  { type: "Stationery" },
];

const COLLECTIONS = [
  {
    title: "Premium Pens",
    desc: "Gel, roller, fountain — write smoother.",
    tag: "Pen",
    badge: "Best Seller",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=870&auto=format&fit=crop",
  },
  {
    title: "Notebooks & Journals",
    desc: "Dotted, ruled, plain — for every idea.",
    tag: "Notebook",
    badge: "Popular",
    imageUrl:
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=870&auto=format&fit=crop",
  },
  {
    title: "Art Supplies",
    desc: "Colors, brushes, sketching essentials.",
    tag: "Art Supply",
    badge: "Hot",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=870&auto=format&fit=crop",
  },
  {
    title: "Office Tools",
    desc: "Organize your desk like a pro.",
    tag: "Office Tool",
    badge: "Stocked",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=870&auto=format&fit=crop",
  },
  {
    title: "Gift & Study Kits",
    desc: "Curated combos for gifting and studying.",
    tag: "Kit",
    badge: "New",
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=870&auto=format&fit=crop",
  },
];

/* ---------- PAGE ---------- */

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* HERO SLIDER */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="h-70 w-full sm:h-105 md:h-140"
        >
          {HERO_BANNERS.map((src, idx) => (
            <SwiperSlide key={src}>
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt={`Hero banner ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />

                {/* dark overlay + subtle gold gradient */}
                <div className="pointer-events-none absolute inset-0 bg-black/55" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-amber-500/15 via-transparent to-yellow-500/10" />

                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-6xl px-6">
                    <div className="max-w-xl">
                      <p className="mb-2 text-sm font-semibold tracking-wide text-stone-200/90">
                        Pens • Notebooks • Art • Office • Gifts
                      </p>

                      <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Stationery that sparks ideas.
                      </h2>

                      <p className="mt-3 max-w-lg text-sm text-stone-200/80">
                        Premium writing tools, notebooks, and desk essentials—
                        packed with care and delivered fast.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          to="/products"
                          className="inline-flex items-center justify-center rounded-xl bg-[#d4af37] px-7 py-3 text-sm font-semibold text-stone-950 shadow-lg transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-500/25"
                        >
                          Shop stationery
                        </Link>

                        <Link
                          to="/products/?type=Notebook"
                          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
                        >
                          Browse notebooks
                        </Link>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-200/70">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          ✨ Premium picks
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          🎁 Gift-ready kits
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          📦 Fast dispatch
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-stone-950 to-transparent" />
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-white/10 bg-stone-950">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
          <TrustItem
            title="Quality you can feel"
            desc="Curated, reliable, and clean finishes."
            icon="✨"
          />
          <TrustItem
            title="Fast dispatch"
            desc="Quick packing & shipping."
            icon="🚚"
          />
          <TrustItem
            title="Secure payments"
            desc="Safe checkout & invoices."
            icon="🔒"
          />
        </div>
      </section>

      {/* SHOP BY TYPE */}
      <section className="bg-linear-to-b from-stone-950 via-stone-950 to-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Shop by type
              </h2>
              <p className="mt-1 text-sm text-stone-300">
                Jump straight into what you need.
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-amber-300 hover:text-amber-200 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {TYPE_DATA.map((t) => (
              <TypeCard key={t.type} type={t.type} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="bg-linear-to-b from-stone-900 via-stone-950 to-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Featured collections
              </h2>
              <p className="mt-1 text-sm text-stone-300">
                Curated picks for easy shopping.
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-amber-300 hover:text-amber-200 hover:underline"
            >
              View all products →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {COLLECTIONS.map((c) => (
              <CollectionCard
                key={c.title}
                title={c.title}
                desc={c.desc}
                tag={c.tag}
                badge={c.badge}
                imageUrl={c.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND HERO */}
      <section className="relative overflow-hidden bg-linear-to-b from-stone-950 via-stone-900 to-stone-950 text-white">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-stone-100">
              ✍️ Build your desk, your way
            </span>

            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
              Create, plan, and ship—beautifully.
            </h1>

            <p className="mt-4 max-w-xl text-base text-stone-200/75">
              From everyday pens to art supplies and premium
              notebooks—everything you need to write, sketch, and stay
              organized.
            </p>

            <div className="mt-7">
              <Link
                to="/products"
                className="inline-flex rounded-xl bg-[#d4af37] px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 focus:ring-4 focus:ring-amber-500/25"
              >
                Explore catalog
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PreviewCard title="Pens" subtitle="Smooth, bold, precise" />
            <PreviewCard title="Notebooks" subtitle="Dotted, ruled, plain" />
            <PreviewCard title="Art" subtitle="Sketch, paint, color" />
            <PreviewCard title="Desk Tools" subtitle="Staplers, clips, more" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-linear-to-r from-stone-900 via-stone-900 to-stone-800 px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  Need supplies for work or study?
                </h3>
                <p className="mt-1 text-sm text-stone-200/75">
                  Pens, notebooks, paper, kits, and office tools—ready to ship.
                </p>
              </div>

              <Link
                to="/products"
                className="rounded-xl bg-[#d4af37] px-6 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300"
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function PreviewCard({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-stone-200/70">{subtitle}</p>
    </div>
  );
}

function TrustItem({ title, desc, icon }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
        <span>{icon}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-stone-200/70">{desc}</p>
      </div>
    </div>
  );
}

function TypeCard({ type }) {
  const icon = getTypeIcon(type);

  return (
    <Link
      to={`/products/?type=${encodeURIComponent(type)}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-500/15"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/10 text-lg">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{type}</p>
          <p className="mt-0.5 text-xs text-stone-200/70">Browse →</p>
        </div>
      </div>
    </Link>
  );
}

function CollectionCard({ title, desc, tag, badge, imageUrl }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md">
      <div className="relative h-44">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/65" />

        <span className="absolute left-4 top-4 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-semibold text-stone-950">
          {badge}
        </span>
      </div>

      <div className="p-5">
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-stone-200/70">{desc}</p>

        <Link
          to={`/products/?type=${encodeURIComponent(tag)}`}
          className="mt-4 inline-flex text-sm font-semibold text-amber-300 hover:text-amber-200 hover:underline"
        >
          Shop collection →
        </Link>
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function getTypeIcon(type) {
  const t = String(type || "").toLowerCase();

  if (t.includes("pencil")) return "✏️";
  if (t === "pen" || t.includes("pen")) return "🖊️";
  if (t.includes("notebook")) return "📓";
  if (t.includes("paper")) return "📄";
  if (t.includes("art")) return "🎨";
  if (t.includes("book")) return "📚";
  if (t.includes("office")) return "📎";
  if (t.includes("accessory")) return "🧷";
  if (t.includes("adhesive")) return "🧴";
  if (t.includes("kit")) return "🎁";
  if (t.includes("stationery")) return "🗂️";

  return "📦";
}
