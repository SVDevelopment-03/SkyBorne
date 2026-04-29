/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import {
  useGetPublishedProductsQuery,
  useExpressProductInterestMutation,
} from "@/store/api/productApi";
import { useGetActiveEcomCategoriesQuery } from "@/store/api/categoryApi";
import { useGetMyOrdersQuery } from "@/store/api/orderApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAddToCartMutation } from "@/store/api/cartApi";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/token";
import Header from "@/components/layout/header";

export default function ShopListingPage() {
  const router = useRouter();
  const token = getAccessToken();
  const showPublicBanner = !token;
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  // Track per-product loading state
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [interestProductId, setInterestProductId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching,
  } = useGetPublishedProductsQuery({
    search: debouncedSearch || undefined,
    categoryId: category || undefined,
    sortBy: sortBy as "newest" | "price-low" | "price-high",
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetActiveEcomCategoriesQuery();
  const { data: myOrdersData } = useGetMyOrdersQuery(
    {
      page: 1,
      limit: 50,
    },
    { skip: !token },
  );

  const [addToCart] = useAddToCartMutation();
  const [expressInterest] = useExpressProductInterestMutation();

  const products = useMemo(() => {
    const raw = (productsData as any)?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [productsData]);

  const categories = useMemo(() => {
    const raw = (categoriesData as any)?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [categoriesData]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value);
  };

  const handleClearFilters = () => {
    setCategory("");
    setSearchInput("");
    setSearch("");
    setSortBy("newest");
  };

  const handleAddToCart = async (productId: string) => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Please login to add items to cart");
      if (typeof window !== "undefined") {
        const next = `${window.location.pathname}${window.location.search}`;
        router.push(`/login?next=${encodeURIComponent(next)}`);
      }
      return;
    }
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

  const handleInterested = async (productId: string) => {
    setInterestProductId(productId);
    try {
      const response = await expressInterest({ productId }).unwrap();
      toast.success(response?.message || "Interest recorded");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save interest");
    } finally {
      setInterestProductId(null);
    }
  };

  const hasActiveFilters = !!category || !!searchInput || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {showPublicBanner ? (
          <div className="px-2 md:p-6 w-full">
            <div className="relative w-full overflow-hidden bg-[#FFF7DD] rounded-3xl">
              <div
                className="flex flex-col inset-0 px-3 md:px-15 pt-4 pb-7 md:py-6 bg-no-repeat bg-cover bg-left md:bg-center h-[75dvh] min-h-[622px] md:min-h-[666px]"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.25) 40%, rgba(0, 0, 0, 0.4) 100%), url('/images/our-services.jpg')",
                }}
              >
                <Header />
                <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 h-full min-h-[510px] text-center">
                  <h1
                    className="text-3xl sm:text-4xl lg:text-6xl text-white"
                    style={{ color: "#FFFFFF" }}
                  >
                    Curated Wellness Essentials
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
                    Support your daily ritual with thoughtfully selected tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
            style={{
              background:
                "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 50%, #FFC29B 100%)",
            }}
          >
            <div className="max-w-7xl mx-auto text-center">
              <h1
                className="text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6"
                style={{ color: "#494949" }}
              >
                Curated Wellness Essentials
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-2xl mx-auto">
                Support your daily ritual with thoughtfully selected tools.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Filter Bar */}
      <section className="bg-card shadow-sm sticky top-0 z-30 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-6 flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/70">
                Search:
              </label>
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-2xl text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/70">
                Category:
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 appearance-none bg-background border border-border rounded-2xl px-4 pr-10 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={categoriesLoading}
                >
                  <option value="">All Products</option>
                  {categories.map((s: any) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              </div>
            </div>

            {/* Sort By */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/70">
                Sort by:
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-12 appearance-none bg-background border border-border rounded-2xl px-4 pr-10 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mt-3">
            <p className="text-xs sm:text-sm text-foreground/60">
              {productsLoading ? "Loading products..." : `${products.length} products`}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs sm:text-sm text-primary underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pt-8 sm:pt-12 lg:pt-14 pb-2 sm:pb-4 lg:pb-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-3xl overflow-hidden shadow-sm animate-pulse border border-border/60"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-7 bg-muted rounded w-16" />
                      <div className="h-9 bg-muted rounded-full w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 sm:py-20 rounded-3xl bg-card border border-border/60">
              <p className="text-lg sm:text-xl text-foreground/60">No products found.</p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-200 ${
                isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
              }`}
            >
              {products.map((product: any) => {
                const cooldownMessage = getCooldownMessage(product._id);
                return (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingProductId === product._id}
                  isAddToCartDisabled={!!cooldownMessage}
                  addToCartDisabledLabel={cooldownMessage || undefined}
                  onInterested={handleInterested}
                  isInterested={interestProductId === product._id}
                />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
