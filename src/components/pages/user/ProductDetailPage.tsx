/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from './ImageWithFallback';
import { Minus, Plus, Star, ChevronLeft } from 'lucide-react';
import { useGetProductByIdQuery } from '@/store/api/productApi';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const product = (data as any)?.data ?? data;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description');

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </div>
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-3xl animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-12 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl mb-4">Product not found</h2>
          <Link href="/product" className="text-primary hover:underline">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel =
    typeof product.category === 'object' && product.category !== null
      ? product.category.title ?? product.category.name ?? ''
      : '';

  return (
    <div className="min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/product" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Image */}
          <div className="space-y-4">
            <div className="bg-card rounded-3xl overflow-hidden shadow-lg">
              <div className="aspect-square">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnail strip — same image repeated */}
            {/* <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <div className="aspect-square">
                    <ImageWithFallback
                      src={product.image}
                      alt={`${product.name} ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              {categoryLabel && (
                <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary-foreground rounded-full text-sm mb-4">
                  {categoryLabel}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl mb-4">{product.name}</h1>
              <p className="text-3xl text-primary font-serif">${product.price}</p>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-card rounded-full shadow-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-background rounded-full transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-8 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-background rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 px-8 bg-card hover:bg-card/80 text-foreground rounded-full transition-all shadow-md hover:shadow-lg border border-border">
                Add to Cart
              </button>
              <button
                className="w-full py-4 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)',
                  color: '#FFFFFF'
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Section */}
      {/* <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          <div className="flex border-b border-border">
            {[
              { key: 'description', label: 'Description' },
              { key: 'shipping', label: 'Shipping Info' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We ship worldwide with care and speed.
                </p>
                <div className="bg-background rounded-2xl p-6 mt-6">
                  <h4 className="font-medium mb-3">Shipping Options:</h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Standard Shipping (3-5 business days) - Free on orders over $75</li>
                    <li>• Express Shipping (1-2 business days) - $15</li>
                    <li>• International Shipping available</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}
    </div>
  );
}