/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { toast } from "sonner"; // or your toast library

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  quantity,
  className = "",
}: AddToCartButtonProps) {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId, quantity }).unwrap();
      setAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add to cart");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || added}
      className={`w-full py-4 px-8 bg-card hover:bg-card/80 text-foreground rounded-full transition-all shadow-md hover:shadow-lg border border-border flex items-center justify-center gap-2 disabled:opacity-70 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : added ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {isLoading ? "Adding..." : added ? "Added!" : "Add to Cart"}
    </button>
  );
}