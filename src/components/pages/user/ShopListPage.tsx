/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useGetPublishedProductsQuery } from "@/store/api/productApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { toast } from "sonner";

export default function ShopListingPage() {
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  // Track per-product loading state
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

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

  const { data: servicesData, isLoading: servicesLoading } =
    useGetServicesQuery(undefined);

  const [addToCart] = useAddToCartMutation();

  const products = useMemo(() => {
    const raw = (productsData as any)?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [productsData]);

  const categories = useMemo(() => {
    const raw = (servicesData as any)?.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [servicesData]);

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
    setAddingProductId(productId);
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add to cart");
    } finally {
      setAddingProductId(null);
    }
  };

  const hasActiveFilters = !!category || !!searchInput || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
          style={{
            background:
              "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 50%, #FFC29B 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6">
              Curated Wellness Essentials
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-2xl mx-auto">
              Support your daily ritual with thoughtfully selected tools.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-card shadow-sm sticky top-0 z-30 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col gap-4 lg:gap-5">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-2xl text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Category Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/70">
                  Category:
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={servicesLoading}
                  >
                    <option value="">All Products</option>
                    {categories.map((s: any) => (
                      <option key={s._id} value={s._id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
                </div>
              </div>

              {/* Sort By */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground/70">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-2xl px-4 py-3 pr-10 text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
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
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 sm:py-12 lg:py-14 px-4 sm:px-6">
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
              {products.map((product: any) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingProductId === product._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
