// Navbar.jsx (dark electronics theme)
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { signOut } from "../features/auth/auth.service";
import { useCartStore } from "../store/cart.store";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const items = useCartStore((s) => s.items);
  const [open, setOpen] = useState(false);

  const cartCount = useMemo(
    () => items.reduce((sum, it) => sum + (it.qty ?? it.quantity ?? 1), 0),
    [items],
  );

  if (loading) return null;

  const NavItem = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={({ isActive }) =>
        cx(
          "rounded-xl px-3 py-2 text-sm font-semibold transition",
          "hover:bg-white/10 hover:text-white",
          isActive ? "bg-white/10 text-white" : "text-slate-300",
        )
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950 text-slate-100 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* BRAND */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-2 py-1 bg-white font-extrabold tracking-tight text-white hover:bg-white/5"
            aria-label="Go to homepage"
          >
            <img src="/HAVE.png" alt="logo" className="h-20 w-46" />
          </Link>
        </div>

        {/* DESKTOP */}
        <div className="hidden items-center gap-2 md:flex">
          <NavItem to="/products">Products</NavItem>

          <NavItem to="/cart">
            <span className="flex items-center gap-2">
              Cart
              <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[#d4af37] px-2 py-0.5 text-xs font-extrabold text-slate-950">
                {cartCount}
              </span>
            </span>
          </NavItem>

          {user ? (
            <>
              <NavItem to="/orders">My Orders</NavItem>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="rounded-xl bg-[#d4af37] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#d4af37] focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#d4af38] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#d4af37] focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="relative rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
            aria-label="Cart"
          >
            Cart
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-extrabold text-slate-950">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      <div className={cx("md:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto max-w-6xl border-t border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-1">
            <NavItem to="/products">Products</NavItem>

            {user ? (
              <>
                <NavItem to="/orders">My Orders</NavItem>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="mt-2 w-full rounded-xl bg-[#d4af37] px-4 py-2 text-left text-sm font-semibold text-slate-950 transition  focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login">Login</NavItem>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full rounded-xl bg-[#d4af37] px-4 py-2 text-center text-sm font-semibold text-slate-950 transition focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
                >
                  Sign up
                </Link>
              </>
            )}

            <p className="mt-3 text-xs text-slate-400">
              Secure checkout • Fast dispatch • ESD-safe packing
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
