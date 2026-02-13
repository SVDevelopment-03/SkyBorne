/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getRelatedProducts } from '../data/products';
import { imageMap } from './imageMap';
import { ImageWithFallback } from './ImageWithFallback';
import { Minus, Plus, Star, ChevronLeft } from 'lucide-react';
import { ProductCard } from './ProductCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const product = id ? getProductById(id) : undefined;
  const relatedProducts = id ? getRelatedProducts(id) : [];
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl mb-4">Product not found</h2>
          <Link href="/" className="text-primary hover:underline">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = imageMap[product.image];

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
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="bg-card rounded-3xl overflow-hidden shadow-lg">
              <div className="aspect-square">
                <ImageWithFallback
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Thumbnail images - showing same image for demo */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <div className="aspect-square">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={`${product.name} ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary-foreground rounded-full text-sm mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl mb-4">{product.name}</h1>
              <p className="text-3xl text-primary font-serif">${product.price}</p>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed">
              {product.longDescription}
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
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'shipping', label: 'Shipping Info' },
              { key: 'reviews', label: 'Reviews' }
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

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <ul className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground/80">{spec}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {product.shippingInfo}
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

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-primary text-primary' : 'text-foreground/20'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.author}</span>
                      <span className="text-sm text-foreground/50">{review.date}</span>
                    </div>
                    <p className="text-foreground/80">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {/* {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-3xl mb-8">Pairs Well With</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                imageUrl={imageMap[relatedProduct.image]}
              />
            ))}
          </div>
        </section>
      )} */}
    </div>
  );
}