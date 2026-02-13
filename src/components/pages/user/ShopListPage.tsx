"use client"
import { useState } from 'react';
import { ProductCard } from './ProductCard'; 
import { products } from '../data/products';
import { imageMap } from './imageMap';
import { ChevronDown } from 'lucide-react';

export default function ShopListingPage() {
  const [category, setCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredProducts = products.filter(p => 
    category === 'All' || p.category === category
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // newest (default order)
  });

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="py-24 px-6"
          style={{
            background: 'linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 50%, #FFC29B 100%)'
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
            {/* Category Filter */}
            <div className="flex gap-4 items-center">
              <label className="text-sm font-medium text-foreground/70">Category:</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none bg-background border border-border rounded-2xl px-6 py-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="All">All Products</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Apparel">Apparel</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex gap-4 items-center">
              <label className="text-sm font-medium text-foreground/70">Sort by:</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-background border border-border rounded-2xl px-6 py-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
      </section>

      {/* Product Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={imageMap[product.image]}
              />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-foreground/60">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
