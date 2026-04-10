// ReturnsRefunds.jsx (dark electronics theme)
import React from "react";
import { Link } from "react-router-dom";

export default function ReturnsRefunds() {
  return (
    <div className="min-h-[70vh] bg-linear-to-b from-stone-950 via-stone-950 to-stone-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <div className="text-sm text-slate-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>{" "}
            <span className="text-slate-600">/</span>{" "}
            <span className="font-semibold text-white">Returns & Refunds</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Returns & Refund Policy
          </h1>
        </div>

        <div className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
          <section>
            <h2 className="text-sm font-bold text-white">Return Window</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We offer returns within{" "}
              <span className="font-semibold text-slate-100">7 days</span> of
              delivery (example). Requests raised after the window may not be
              accepted.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Eligibility</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Item must be unused and in original condition.</li>
              <li>Original labels and packaging must be intact.</li>
              <li>Return is subject to quality check upon pickup/receipt.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Non-Returnable Items
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Items marked “Final Sale” (example).</li>
              <li>Customized or altered products (if applicable).</li>
              <li>Products damaged due to misuse or mishandling.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              How to Initiate a Return
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Contact support at{" "}
                <span className="font-semibold text-cyan-300">
                  sales@havelook.co.in
                </span>{" "}
                with your order ID.
              </li>
              <li>Share images if the product is damaged/incorrect.</li>
              <li>
                We will arrange pickup (subject to serviceability) or provide
                return instructions.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Exchange</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Exchanges are available (subject to stock). If the requested item
              is unavailable, we will process a refund or store credit as per
              your preference.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Refunds</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Once the returned item passes quality check, refunds are processed
              within{" "}
              <span className="font-semibold text-slate-100">
                5–10 business days
              </span>{" "}
              (example) to the original payment method. COD orders may be
              refunded via bank transfer/UPI after verification.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">
              Damaged / Wrong Item
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              If you receive a damaged or incorrect item, please contact us
              within{" "}
              <span className="font-semibold text-slate-100">48 hours</span> of
              delivery with unboxing images/video (if available). We will
              resolve it via replacement or refund.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              For any questions, reach us at{" "}
              <span className="font-semibold text-cyan-300">
                sales@havelook.co.in
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
