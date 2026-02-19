"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useGetMyCartQuery } from "@/store/api/cartApi";

export function CartIcon() {
  const { data } = useGetMyCartQuery();
  const itemCount = data?.data?.items?.length ?? 0;

  return (
    <Link href="/cart" className="relative inline-flex items-center justify-center p-2 hover:text-primary transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full"
          style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
        >
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}