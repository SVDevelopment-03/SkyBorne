"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet } from 'lucide-react';
import { ImageWithFallback } from '@/components/pages/user/ImageWithFallback';

// ── Types ──────────────────────────────────────────────────────────
interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ── Hook: useCart ──────────────────────────────────────────────────
// Replace this with your real cart store (Redux, Zustand, Context, etc.)
// For now it reads from localStorage or returns empty
function useCart(): CartItem[] {
  // TODO: replace with your actual cart selector e.g. useSelector(selectCartItems)
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('cart') ?? '[]');
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
  const [shippingCost, setShippingCost] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call your payment/order API here, then redirect
    router.push('/thank-you');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl mb-12 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Contact Information */}
              <div className="bg-card rounded-3xl p-8 shadow-md">
                <h3 className="text-xl mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground/70">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground/70">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                        type="text"
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-foreground/70">Last Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground/70">Address</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Wellness St"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm mb-2 text-foreground/70">City</label>
                      <input
                        type="text"
                        required
                        placeholder="San Francisco"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-foreground/70">ZIP</label>
                      <input
                        type="text"
                        required
                        placeholder="94102"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              {/* <div className="bg-card rounded-3xl p-8 shadow-md">
                <h3 className="text-xl mb-6">Shipping Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-background rounded-2xl cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        defaultChecked
                        className="accent-primary"
                        onChange={() => setShippingCost(0)}
                      />
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-foreground/60">3-5 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">Free</span>
                  </label>
                  <label className="flex items-center justify-between p-4 bg-background rounded-2xl cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        className="accent-primary"
                        onChange={() => setShippingCost(15)}
                      />
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-foreground/60">1-2 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">$15</span>
                  </label>
                </div>
              </div> */}

              {/* Payment */}
              {/* <div className="bg-card rounded-3xl p-8 shadow-md">
                <h3 className="text-xl mb-6">Payment</h3>

                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-background/80'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all ${
                      paymentMethod === 'apple'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-background/80'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                    Apple Pay
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-foreground/70">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-foreground/70">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-foreground/70">CVV</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple' && (
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-full mb-4">
                      <Wallet className="w-8 h-8 text-foreground" />
                    </div>
                    <p className="text-foreground/70">
                      You'll be redirected to complete your payment with Apple Pay
                    </p>
                  </div>
                )}
              </div> */}

              {/* Mobile submit */}
              <button
                type="submit"
                className="w-full lg:hidden py-4 px-8 rounded-full text-white text-lg shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)' }}
              >
                Pay Now ${total.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl mb-6">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {cartItems.length === 0 ? (
                  <p className="text-foreground/50 text-sm text-center py-4">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-20 h-20 bg-background rounded-2xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{item.name}</h4>
                        <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
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
                  <span className={shippingCost === 0 ? 'text-secondary' : ''}>
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl mb-6">
                <span>Total</span>
                <span className="text-primary font-serif">${total.toFixed(2)}</span>
              </div>

              {/* Desktop submit */}
              <button
                type="button"
                onClick={handleSubmit as any}
                className="hidden lg:block w-full py-4 px-8 rounded-full text-white text-lg shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)' }}
              >
                Pay Now ${total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}