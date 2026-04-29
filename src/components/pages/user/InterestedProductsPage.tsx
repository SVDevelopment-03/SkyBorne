/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import {
  useGetProductInterestsQuery,
  useGetPublishedProductsQuery,
  type Product,
  type ProductInterest,
} from "@/store/api/productApi";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { useGetMyOrdersQuery } from "@/store/api/orderApi";
import useGetUser from "@/hooks/useGetUser";
import toast from "react-hot-toast";

export default function InterestedProductsPage() {
  const { user } = useGetUser();
  const userId = user?.id || user?._id;

  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { data: myOrdersData } = useGetMyOrdersQuery(
    {
      page: 1,
      limit: 50,
    },
    { skip: !userId },
  );

  const { data: interestsData, isLoading: interestsLoading, isFetching: interestsFetching } =
    useGetProductInterestsQuery(
      { page: 1, limit: 100, search: "" },
      { skip: !userId }
    );

  const { data: productsData, isLoading: productsLoading, isFetching: productsFetching } =
    useGetPublishedProductsQuery({}, { skip: !userId });

  const interests = useMemo<ProductInterest[]>(() => {
    const raw = (interestsData as any)?.data?.interests ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [interestsData]);

  const userInterests = useMemo<ProductInterest[]>(() => {
    if (!userId) return [];
    return interests.filter((interest) => {
      const interestUserId = (interest as any)?.user?._id || (interest as any)?.user?.id;
      return interestUserId === userId;
    });
  }, [interests, userId]);

  const sortedInterests = useMemo<ProductInterest[]>(() => {
    return [...userInterests].sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [userInterests]);

  const products = useMemo<Product[]>(() => {
    const raw = (productsData as any)?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [productsData]);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product._id, product]));
  }, [products]);

  const interestedProducts = useMemo<Product[]>(() => {
    return sortedInterests
      .map((interest) => {
        const productId = (interest as any)?.product?._id;
        return productId ? productMap.get(productId) : null;
      })
      .filter((product): product is Product => Boolean(product));
  }, [sortedInterests, productMap]);

  const missingCount = useMemo(() => {
    return sortedInterests.reduce((count, interest) => {
      const productId = (interest as any)?.product?._id;
      if (!productId || !productMap.has(productId)) return count + 1;
      return count;
    }, 0);
  }, [sortedInterests, productMap]);

  const [addToCart] = useAddToCartMutation();

  const productCooldownUntilMap = useMemo(() => {
    const map = new Map<string, number>();
    const orders = Array.isArray((myOrdersData as any)?.data)
      ? (myOrdersData as any).data
      : [];
    const now = Date.now();
    const blockedStatuses = new Set(["cancelled", "refunded", "failed"]);

    for (const order of orders) {
      const orderStatus = String(order?.orderStatus || "").toLowerCase();
      const paymentStatus = String(order?.paymentStatus || "").toLowerCase();
      if (blockedStatuses.has(orderStatus) || blockedStatuses.has(paymentStatus)) {
        continue;
      }
      const createdAtMs = new Date(order?.createdAt || order?.paidAt || "").getTime();
      if (!Number.isFinite(createdAtMs)) continue;
      const cooldownUntil = createdAtMs + 24 * 60 * 60 * 1000;
      if (cooldownUntil <= now) continue;

      const items = Array.isArray(order?.items) ? order.items : [];
      for (const item of items) {
        const productId =
          typeof item?.product === "string"
            ? item.product
            : String(item?.product?._id || item?.product?.id || "");
        if (!productId) continue;
        const current = map.get(productId) || 0;
        if (cooldownUntil > current) {
          map.set(productId, cooldownUntil);
        }
      }
    }
    return map;
  }, [myOrdersData]);

  const getCooldownMessage = (productId: string): string | null => {
    const cooldownUntil = productCooldownUntilMap.get(productId);
    if (!cooldownUntil) return null;
    const remainingMs = cooldownUntil - Date.now();
    if (remainingMs <= 0) return null;
    const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `Re-order in ${hours}h ${minutes}m`;
  };

  const handleAddToCart = async (productId: string) => {
    const cooldownMessage = getCooldownMessage(productId);
    if (cooldownMessage) {
      toast.error(
        "You already purchased this product in the last 24 hours. Please try later.",
      );
      return;
    }
    setAddingProductId(productId);
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success("Product added to cart");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add to cart");
    } finally {
      setAddingProductId(null);
    }
  };

  const isLoading = interestsLoading || productsLoading || !userId;
  const isFetching = interestsFetching || productsFetching;
  const hasInterest = userInterests.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (interestedProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center shadow-md">
          <Heart className="w-12 h-12 text-foreground/30" />
        </div>
        <h2 className="text-3xl text-center">
          {hasInterest ? "Interested items are unavailable" : "No interested products yet"}
        </h2>
        <p className="text-foreground/60 text-center max-w-sm">
          {hasInterest
            ? "Some items may be unpublished or out of stock. We'll keep tracking them for you."
            : "When a product is out of stock, tap Interested and it will appear here."}
        </p>
        <Link
          href="/product"
          className="py-3 px-8 rounded-full text-white shadow-md hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl">Interested Products</h1>
            <p className="text-foreground/60">
              We&rsquo;ll notify you when these are back in stock.
            </p>
          </div>
          <Link href="/product" className="text-sm text-primary underline underline-offset-4">
            Browse all products
          </Link>
        </div>

        {missingCount > 0 && (
          <div className="mb-6 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-foreground/70">
            {missingCount} item{missingCount > 1 ? "s" : ""} no longer visible in the catalog.
          </div>
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-200 ${
            isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
          }`}
        >
          {interestedProducts.map((product) => {
            const cooldownMessage = getCooldownMessage(product._id);
            return (
            <ProductCard
              key={product._id}
              product={product as any}
              onAddToCart={handleAddToCart}
              isAddingToCart={addingProductId === product._id}
              isAddToCartDisabled={!!cooldownMessage}
              addToCartDisabledLabel={cooldownMessage || undefined}
              isInterestSaved
            />
            );
          })}
        </div>
      </div>
    </div>
  );
}
