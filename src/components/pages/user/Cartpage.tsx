"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/components/pages/user/ImageWithFallback";
import {
  useGetMyCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "@/store/api/cartApi";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { data, isLoading, isFetching } = useGetMyCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const cart = data?.data;
  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;
  const total = subtotal;

  const handleQuantityChange = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateItem({ productId, quantity: newQty }).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem(productId).unwrap();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  // ── Loading ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────
  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center shadow-md">
          <ShoppingBag className="w-12 h-12 text-foreground/30" />
        </div>
        <h2 className="text-3xl text-center">Your cart is empty</h2>
        <p className="text-foreground/60 text-center max-w-sm">
          {`Looks like you haven't added anything yet. Explore our products and find something you love!`}
        </p>
        <Link
          href="/product"
          className="py-3 px-8 rounded-full text-white shadow-md hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Cart with items ───────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl">
            My Cart{" "}
            <span className="text-foreground/40 text-2xl">({items.length} items)</span>
          </h1>
          <button
            onClick={handleClear}
            disabled={isClearing || isFetching}
            className="text-sm text-foreground/50 hover:text-destructive transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Item list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product}
                className={`bg-card rounded-3xl p-6 shadow-md flex gap-5 transition-opacity ${
                  isFetching ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-background rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg mb-1 truncate">{item.name}</h3>
                  <p className="text-primary font-serif text-lg">${item.price.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty controls */}
                    <div className="flex items-center bg-background rounded-full shadow-sm">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.product, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-5 font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.product, item.quantity + 1)
                        }
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line total + Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.product)}
                        className="text-foreground/40 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-3xl p-8 shadow-lg space-y-6">
              <h3 className="text-xl">Order Summary</h3>

              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span className="text-secondary">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl">
                <span>Total</span>
                <span className="text-primary font-serif">${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-4 px-8 rounded-full text-white text-lg shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)",
                }}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/product"
                className="block text-center text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
