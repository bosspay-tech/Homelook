function ProductCard({ product, onViewDetails }) {
  const price = Number(product?.base_price ?? 0);
  const mrp = Number(product?.mrp ?? 0);
  const hasDiscount = mrp > price;
  const discountPercentage = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  const inStock = product?.is_active !== false;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/10">
      {/* Image */}
      <div className="relative aspect-4/5 overflow-hidden bg-slate-900">
        <img
          src={product?.image_url}
          alt={product?.title}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* overlays */}
        <div className="pointer-events-none absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-cyan-500/10 via-transparent to-violet-500/10" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product?.badge && (
            <span className="rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="w-fit rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-extrabold text-white shadow-lg">
              {discountPercentage}% OFF
            </span>
          )}
          {!inStock && (
            <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-slate-300">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick Action */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onViewDetails?.(product)}
            className="translate-y-4 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-extrabold text-slate-950 shadow-xl transition-transform duration-300 group-hover:translate-y-0 hover:bg-cyan-400"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            {product?.category || "Electronics"}
          </span>

          {typeof product?.rating === "number" && (
            <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400">
              <span className="text-sm">★</span>
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg font-extrabold text-white transition-colors group-hover:text-cyan-300">
          {product?.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-200/70">
          {product?.short_description ||
            product?.description ||
            "Reliable component for prototyping and production builds."}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs font-medium text-slate-500 line-through">
                ₹{mrp.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-black text-white">
              ₹{price.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition-all hover:border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950"
            aria-label="View Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
