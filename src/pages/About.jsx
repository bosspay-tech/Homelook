import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-stone-950 pt-24 pb-12 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-white mb-6">About Us</h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="mb-4">
            Welcome to Havelook Collections. We are dedicated to providing the highest quality products and services to our customers.
          </p>
          <p className="mb-4">
            Our mission is to bring you the best selection of Journals, Registers, Crayons, Pens, and more, all with exceptional customer service and support.
          </p>
          <p className="mb-4">
            Thank you for choosing Havelook Collections.
          </p>
        </div>
      </div>
    </div>
  );
}
