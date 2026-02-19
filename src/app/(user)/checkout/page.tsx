/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/pages/user/ImageWithFallback";
import { useGetMyCartQuery } from "@/store/api/cartApi";
import { useCreateCheckoutSessionMutation } from "@/store/api/EcompaymentApi";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { data, isLoading } = useGetMyCartQuery();
  const [createCheckoutSession, { isLoading: isCreatingSession }] =
    useCreateCheckoutSessionMutation();

  const cart = data?.data;
  const cartItems = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;
  const total = subtotal;

  // ── Form state ────────────────────────────────────────────────────
  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const result = await createCheckoutSession({
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          zip: form.zip,
          email: form.email,
          phone: form.phone,
        },
      }).unwrap();

      // ── Redirect to Stripe Checkout ───────────────────────────────
      window.location.href = result.data.checkoutUrl;
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create checkout session");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl mb-12 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Left: Form ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Contact Information */}
            <div className="bg-card rounded-3xl p-8 shadow-md">
              <h3 className="text-xl mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground/70">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground/70">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card rounded-3xl p-8 shadow-md">
              <h3 className="text-xl mb-6">Shipping Address</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground/70">First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground/70">Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground/70">Address</label>
                  <input
                    name="address"
                    type="text"
                    required
                    placeholder="123 Wellness St"
                    value={form.address}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm mb-2 text-foreground/70">City</label>
                    <input
                      name="city"
                      type="text"
                      required
                      placeholder="San Francisco"
                      value={form.city}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground/70">ZIP</label>
                    <input
                      name="zip"
                      type="text"
                      required
                      placeholder="94102"
                      value={form.zip}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stripe badge */}
            <div className="flex items-center justify-center gap-2 text-foreground/40 text-sm">
              <Lock className="w-4 h-4" />
              Secure payment powered by Stripe
            </div>

            {/* Mobile submit */}
            <button
              type="submit"
              disabled={isCreatingSession || cartItems.length === 0}
              className="w-full lg:hidden py-4 px-8 rounded-full text-white text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
            >
              {isCreatingSession ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to Stripe…
                </>
              ) : (
                `Pay $${total.toFixed(2)} with Stripe`
              )}
            </button>
          </form>

          {/* ── Right: Order Summary ────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl mb-6">Order Summary</h3>

              {/* Cart Items — read-only */}
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {cartItems.length === 0 ? (
                  <p className="text-foreground/50 text-sm text-center py-4">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.product} className="flex gap-4">
                      <div className="w-16 h-16 bg-background rounded-2xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-0.5 truncate">{item.name}</h4>
                        <p className="text-sm text-foreground/50">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium shrink-0 self-center">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span className="text-secondary">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl mb-6">
                <span>Total</span>
                <span className="text-primary font-serif">${total.toFixed(2)}</span>
              </div>

              {/* Desktop submit */}
              <button
                type="button"
                disabled={isCreatingSession || cartItems.length === 0}
                onClick={handleSubmit as any}
                className="hidden lg:flex items-center justify-center gap-2 w-full py-4 px-8 rounded-full text-white text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
              >
                {isCreatingSession ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to Stripe…
                  </>
                ) : (
                  `Pay $${total.toFixed(2)} with Stripe`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}