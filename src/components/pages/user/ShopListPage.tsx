/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useGetPublishedProductsQuery } from "@/store/api/productApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import { useDebounce } from "@/hooks/useDebounce"; // or inline debounce below

export default function ShopListingPage() {
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  // Debounce search so we don't fire on every keystroke
  // If you don't have a useDebounce hook, use the inline version below
  const debouncedSearch = useDebounce(searchInput, 400);

  const { data: productsData, isLoading: productsLoading, isFetching } = useGetPublishedProductsQuery({
    search: debouncedSearch || undefined,
    categoryId: category || undefined,
    sortBy: sortBy as "newest" | "price-low" | "price-high",
  });

  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery(undefined);

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

  const hasActiveFilters = !!category || !!searchInput || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="py-24 px-6"
          style={{
            background: "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 50%, #FFC29B 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl mb-6">Curated Wellness Essentials</h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Support your daily ritual with thoughtfully selected tools.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-card shadow-sm sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-2xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex gap-3 items-center">
                <label className="text-sm font-medium text-foreground/70 whitespace-nowrap">
                  Category:
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none bg-background border border-border rounded-2xl px-6 py-2.5 pr-10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              <div className="flex gap-3 items-center">
                <label className="text-sm font-medium text-foreground/70 whitespace-nowrap">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-background border border-border rounded-2xl px-6 py-2.5 pr-10 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-3xl overflow-hidden shadow-md animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-3">
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
            <div className="text-center py-20">
              <p className="text-xl text-foreground/60">No products found.</p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm text-primary underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}