/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useAddToCartMutation } from "@/store/api/cartApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

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
      toast.success("Product added to cart");
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add to cart");
    }
  };

  return (
    <Button
      variant="theme"
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading || added}
      className={`w-full sm:w-auto px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : added ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {isLoading ? "Adding..." : added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
