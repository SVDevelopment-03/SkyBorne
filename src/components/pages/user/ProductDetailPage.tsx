/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "./ImageWithFallback";
import { Minus, Plus, ChevronLeft, Loader2, Check, ShoppingCart } from "lucide-react";
import {
  useGetProductByIdQuery,
  useGetPublishedProductsQuery,
  useExpressProductInterestMutation,
} from "@/store/api/productApi";
import { useAddToCartMutation } from "@/store/api/cartApi";
import toast from "react-hot-toast";
import { ProductCard } from "./ProductCard";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const product = (data as any)?.data ?? data;

  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [expressInterest, { isLoading: savingInterest }] =
    useExpressProductInterestMutation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [interestSaved, setInterestSaved] = useState(false);
  const [addingRelatedId, setAddingRelatedId] = useState<string | null>(null);
  const [savingRelatedId, setSavingRelatedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "shipping" | "reviews"
  >("description");

  const categoryId =
    typeof product?.category === "object" && product?.category !== null
      ? (product.category as any)?._id
      : product?.category;

  const { data: relatedByCategoryResponse, isLoading: relatedByCategoryLoading } =
    useGetPublishedProductsQuery({
      categoryId: categoryId || undefined,
      sortBy: "newest",
    });
  const { data: relatedAllResponse, isLoading: relatedAllLoading } =
    useGetPublishedProductsQuery({
      sortBy: "newest",
    });

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: id, quantity }).unwrap();
      setAddedToCart(true);
      toast.success("Product added to cart");
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add to cart");
    }
  };

  const handleInterested = async () => {
    try {
      const response = await expressInterest({ productId: id }).unwrap();
      setInterestSaved(true);
      toast.success(response?.message || "Interest recorded");
      setTimeout(() => setInterestSaved(false), 2000);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save interest");
    }
  };

  const handleRelatedAddToCart = async (productId: string) => {
    try {
      setAddingRelatedId(productId);
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success("Product added to cart");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to add to cart");
    } finally {
      setAddingRelatedId(null);
    }
  };

  const handleRelatedInterested = async (productId: string) => {
    try {
      setSavingRelatedId(productId);
      const response = await expressInterest({ productId }).unwrap();
      toast.success(response?.message || "Interest recorded");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save interest");
    } finally {
      setSavingRelatedId(null);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </div>
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="aspect-square bg-muted rounded-3xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-12 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
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
    typeof product.category === "object" && product.category !== null
      ? product.category.title ?? product.category.name ?? ""
      : "";

  const isOutOfStock =
    typeof (product as any)?.stock === "number"
      ? (product as any).stock <= 0
      : false;

  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : [];
  const shippingInfo =
    typeof product.shippingInfo === "string" ? product.shippingInfo.trim() : "";
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  const categoryCandidates = Array.isArray(relatedByCategoryResponse?.data)
    ? relatedByCategoryResponse.data
    : [];
  const fallbackCandidates = Array.isArray(relatedAllResponse?.data)
    ? relatedAllResponse.data
    : [];

  const relatedSource =
    categoryCandidates.length > 1 ? categoryCandidates : fallbackCandidates;

  const relatedProducts = relatedSource
    .filter((item: any) => item._id !== product._id)
    .slice(0, 3);

  const relatedLoading = relatedByCategoryLoading || relatedAllLoading;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Image */}
          <div className="bg-card rounded-3xl overflow-hidden shadow-lg">
            <div className="aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
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
              <div className="flex items-center bg-card rounded-full shadow-md w-fit">
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

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOutOfStock ? (
                <button
                  type="button"
                  onClick={handleInterested}
                  disabled={savingInterest || interestSaved}
                  className="w-full py-4 px-8 rounded-full transition-all shadow-md hover:shadow-lg border border-[#B95E82] text-[#B95E82] bg-white"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {savingInterest ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : interestSaved ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                    {savingInterest
                      ? "Saving..."
                      : interestSaved
                        ? "Saved!"
                        : "Interested"}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || addedToCart}
                  className="w-full py-4 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {addingToCart ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : addedToCart ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                    {addingToCart
                      ? "Adding..."
                      : addedToCart
                        ? "Added!"
                        : "Add to Cart"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-card rounded-3xl shadow-md overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border/60">
            {[
              { key: "description", label: "Description" },
              { key: "specs", label: "Specifications" },
              { key: "shipping", label: "Shipping Info" },
              { key: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(
                    tab.key as "description" | "specs" | "shipping" | "reviews"
                  )
                }
                className={`px-4 py-4 text-sm md:text-base font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary bg-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 text-foreground/70 leading-relaxed">
            {activeTab === "description" && (
              <p>{product.description || "No description available for this product."}</p>
            )}

            {activeTab === "specs" && (
              specifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {specifications.map((spec, idx) => (
                    <div
                      key={`${spec.label}-${idx}`}
                      className="flex items-center justify-between border-b border-border/40 pb-2"
                    >
                      <span className="text-foreground/60">{spec.label}</span>
                      <span className="font-medium text-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No specifications available.</p>
              )
            )}

            {activeTab === "shipping" && (
              <div className="text-sm">
                {shippingInfo ? (
                  <p>{shippingInfo}</p>
                ) : (
                  <p>No shipping information available.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4 text-sm">
                {reviews.length > 0 ? (
                  reviews.map((review: any, idx: number) => (
                    <div key={`${review.name || "review"}-${idx}`} className="border-b border-border/40 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">
                          {review.name || "Anonymous"}
                        </span>
                        {review.rating !== undefined && (
                          <span className="text-foreground/60">
                            {review.rating} / 5
                          </span>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-foreground/70">{review.comment}</p>
                      )}
                      {review.createdAt && (
                        <p className="text-xs text-foreground/50 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <p>No reviews yet.</p>
                    <p>Be the first to share your experience with this product.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-serif text-foreground">
            Pairs Well With
          </h2>
        </div>

        {relatedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-card rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((related: any) => (
              <ProductCard
                key={related._id}
                product={related}
                onAddToCart={handleRelatedAddToCart}
                isAddingToCart={addingRelatedId === related._id && addingToCart}
                onInterested={handleRelatedInterested}
                isInterested={savingRelatedId === related._id && savingInterest}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-6 text-sm text-foreground/60">
            No related products found in this category yet.
          </div>
        )}
      </section>
    </div>
  );
}
