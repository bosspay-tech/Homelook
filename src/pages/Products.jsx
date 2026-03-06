import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { STORE_ID } from "../config/store";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ITEMS_PER_PAGE = 12;

/* ---------- SKELETON ---------- */
function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="h-48 bg-white/10" />
      <div className="p-4">
        <div className="h-4 w-2/3 rounded bg-white/10" />
        <div className="mt-3 h-3 w-full rounded bg-white/10" />
        <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
        <div className="mt-4 h-5 w-24 rounded bg-white/10" />
        <div className="mt-4 h-9 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export default function Products() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const type = params.get("type");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let alive = true;

    const fetchProducts = async () => {
      setLoading(true);
      setErr("");

      let query = supabase
        .from("products")
        .select("*")
        .eq("store_id", STORE_ID)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (category) query = query.contains("categories", [category]);
      if (type) query = query.eq("type", type);

      const { data, error } = await query;

      if (!alive) return;

      if (error) {
        setErr(error.message || "Failed to load products.");
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
    return () => {
      alive = false;
    };
  }, [category, type]);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, category, type]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      `${p.title ?? ""} ${p.description ?? ""} ${p.short_description ?? ""}`
        .toLowerCase()
        .includes(s),
    );
  }, [products, q]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (newPage) => {
    const next = Math.max(1, Math.min(newPage, totalPages || 1));
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const headerTitle = type ? `${type}s` : category ? `${category}` : "Stationery";
  const headerDesc = type
    ? `Explore our ${type.toLowerCase()} collection — curated for everyday use.`
    : category
      ? "Browse items in this category."
      : "Pens, notebooks, paper, art supplies & more.";

  return (
    <div className="min-h-[70vh] bg-linear-to-b from-stone-950 via-stone-950 to-stone-900 text-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {headerTitle}
            </h2>
            <p className="mt-1 text-sm text-stone-300">{headerDesc}</p>

            {/* Active filters chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {category ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-stone-200 backdrop-blur">
                  Category:{" "}
                  <span className="text-amber-300">{category}</span>
                </span>
              ) : null}
              {type ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-stone-200 backdrop-blur">
                  Type: <span className="text-amber-300">{type}</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* SEARCH */}
          <div className="w-full sm:w-80">
            <label className="sr-only">Search products</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                🔎
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search stationery…"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-stone-100 outline-none backdrop-blur transition placeholder:text-stone-500 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/15"
              />
            </div>

            {(category || type) && (
              <div className="mt-2">
                <Link
                  to="/products"
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 hover:underline"
                >
                  Clear filters →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ERROR */}
        {err ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        {/* CONTENT */}
        <div className="mt-8">
          {loading ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-stone-300">Loading products…</p>
                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                🗂️
              </div>
              <h3 className="text-lg font-semibold text-white">
                No products found
              </h3>
              <p className="mt-1 text-sm text-stone-300">
                {q.trim()
                  ? "Try a different search term."
                  : "New stock is coming soon."}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {q.trim() && (
                  <button
                    onClick={() => setQ("")}
                    className="rounded-2xl bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                  >
                    Clear search
                  </button>
                )}

                {(category || type) && (
                  <Link
                    to="/products"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-stone-100 backdrop-blur hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* GRID */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="block rounded-3xl focus:outline-none focus:ring-4 focus:ring-amber-500/15"
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- PAGINATION HELPERS ---------- */
function getPageItems(totalPages, currentPage) {
  const siblingCount = 1;
  const showEdges = true;

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];
  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSibling > 2;
  const shouldShowRightDots = rightSibling < totalPages - 1;

  if (showEdges) items.push(1);

  if (shouldShowLeftDots) items.push("...");
  else {
    for (let p = 2; p < leftSibling; p++) items.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== 1 && p !== totalPages) items.push(p);
  }

  if (shouldShowRightDots) items.push("...");
  else {
    for (let p = rightSibling + 1; p < totalPages; p++) items.push(p);
  }

  if (showEdges) items.push(totalPages);

  return items.filter((v, i, a) => i === a.indexOf(v));
}

/* ---------- PAGINATION UI ---------- */
function Pagination({ totalPages, currentPage, onChange }) {
  const items = useMemo(
    () => getPageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="mt-12">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        {/* Meta */}
        <div className="text-sm text-stone-300">
          Page <span className="font-semibold text-white">{currentPage}</span>{" "}
          of <span className="font-semibold text-white">{totalPages}</span>
        </div>

        {/* Controls */}
        <nav
          aria-label="Pagination"
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur"
        >
          {/* Prev */}
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onChange(currentPage - 1)}
            className="group inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-stone-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="h-6 w-px bg-white/10" />

          {/* Page pills */}
          <div className="flex items-center gap-1">
            {items.map((it, idx) =>
              it === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-sm font-semibold text-stone-500"
                >
                  …
                </span>
              ) : (
                <button
                  key={it}
                  type="button"
                  onClick={() => onChange(it)}
                  aria-current={currentPage === it ? "page" : undefined}
                  className={[
                    "h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition",
                    currentPage === it
                      ? "bg-[#d4af37] text-stone-950 shadow-sm"
                      : "text-stone-200 hover:bg-white/10",
                  ].join(" ")}
                >
                  {it}
                </button>
              ),
            )}
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Next */}
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onChange(currentPage + 1)}
            className="group inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-stone-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="text-base leading-none">→</span>
          </button>
        </nav>
      </div>
    </div>
  );
}