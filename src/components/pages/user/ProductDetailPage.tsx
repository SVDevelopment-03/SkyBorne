/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageWithFallback } from "./ImageWithFallback";
import {
  Minus,
  Plus,
  ChevronLeft,
  Loader2,
  Check,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  useGetProductByIdQuery,
  useGetPublishedProductsQuery,
  useExpressProductInterestMutation,
} from "@/store/api/productApi";
import { useAddToCartMutation } from "@/store/api/cartApi";
import toast from "react-hot-toast";
import { ProductCard } from "./ProductCard";
import { getAccessToken } from "@/lib/token";
import {
  PRODUCT_MASTER_GROUPS,
  ProductMasterData,
} from "@/components/Ecompages/productMasterFields";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
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
    const token = getAccessToken();
    if (!token) {
      toast.error("Please login to add items to cart");
      if (typeof window !== "undefined") {
        const next = `${window.location.pathname}${window.location.search}`;
        router.push(`/login?next=${encodeURIComponent(next)}`);
      }
      return;
    }
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
    const token = getAccessToken();
    if (!token) {
      toast.error("Please login to add items to cart");
      if (typeof window !== "undefined") {
        const next = `${window.location.pathname}${window.location.search}`;
        router.push(`/login?next=${encodeURIComponent(next)}`);
      }
      return;
    }
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
  const normalizeSpecKey = (label?: string) =>
    (label || "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  const processingSpec = specifications.find((spec: { label?: string; value?: string }) =>
    normalizeSpecKey(spec.label).includes("processing")
  );
  const deliverySpec = specifications.find((spec: { label?: string; value?: string }) =>
    normalizeSpecKey(spec.label).includes("delivery")
  );
  const formatSpecLabel = (label?: string) =>
    (label || "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const readStringValue = (value: any) => {
    if (value === undefined || value === null) return "";
    return String(value).trim();
  };

  const FEATURE_KEYS: Array<
    "featureBullet1" | "featureBullet2" | "featureBullet3" | "featureBullet4" | "featureBullet5"
  > = [
    "featureBullet1",
    "featureBullet2",
    "featureBullet3",
    "featureBullet4",
    "featureBullet5",
  ];

  const UNIT_PAIRS: Partial<
    Record<keyof ProductMasterData, keyof ProductMasterData>
  > = {
    size: "sizeUnit",
    productLength: "productLengthUnit",
    productHeight: "productHeightUnit",
    productWidthDepth: "productWidthDepthUnit",
    productWeight: "productWeightUnit",
    shippingLength: "shippingLengthUnit",
    shippingHeight: "shippingHeightUnit",
    shippingWidthDepth: "shippingWidthDepthUnit",
    shippingWeight: "shippingWeightUnit",
    recommendedRetailPrice: "recommendedRetailPriceAEUnit",
  };

  const EXCLUDED_MASTER_KEYS = new Set<keyof ProductMasterData>([
    "productCategory",
    "partnerSkuUniqueCode",
    "gtinUpc",
    "featureBullet1",
    "featureBullet2",
    "featureBullet3",
    "featureBullet4",
    "featureBullet5",
    "whatIsInTheBox",
    "longDescription",
    "shippingLength",
    "sizeUnit",
    "productLengthUnit",
    "productHeightUnit",
    "productWidthDepthUnit",
    "productWeightUnit",
    "shippingHeight",
    "shippingWidthDepth",
    "shippingWeight",
    "shippingLengthUnit",
    "shippingHeightUnit",
    "shippingWidthDepthUnit",
    "shippingWeightUnit",
    "recommendedRetailPrice",
    "recommendedRetailPriceAEUnit",
    "hsCode",
  ]);

  const formatValueWithUnit = (
    value: string,
    unit: string,
    key: keyof ProductMasterData
  ) => {
    if (!unit) return value;
    if (key === "recommendedRetailPrice") {
      return `${unit} ${value}`;
    }
    return `${value} ${unit}`;
  };

  const masterSpecs = PRODUCT_MASTER_GROUPS.flatMap((group) =>
    group.fields
      .filter((field) => !EXCLUDED_MASTER_KEYS.has(field.key))
      .map((field) => {
        const rawValue = readStringValue((product as any)?.[field.key]);
        if (!rawValue) return null;
        const unitKey = UNIT_PAIRS[field.key];
        const unitValue = unitKey
          ? readStringValue((product as any)?.[unitKey])
          : "";
        return {
          label: field.label,
          value: unitKey
            ? formatValueWithUnit(rawValue, unitValue, field.key)
            : rawValue,
        };
      })
      .filter(Boolean)
  ) as { label: string; value: string }[];

  const customSpecs = specifications
    .map((spec: { label?: string; value?: string }) => ({
      label: formatSpecLabel(spec.label),
      value: readStringValue(spec.value),
    }))
    .filter((spec) => spec.label && spec.value);

  const combinedSpecs = (() => {
    const seen = new Set<string>();
    const output: { label: string; value: string }[] = [];
    const addItem = (item: { label: string; value: string }) => {
      const key = normalizeSpecKey(item.label);
      if (!key || key === "category" || seen.has(key)) return;
      seen.add(key);
      output.push(item);
    };
    masterSpecs.forEach(addItem);
    customSpecs.forEach(addItem);
    return output;
  })();

  const descriptionText = readStringValue(product.description);
  const featureBullets = FEATURE_KEYS.map((key) =>
    readStringValue((product as any)?.[key])
  ).filter(Boolean);
  const whatIsInTheBox = readStringValue(product.whatIsInTheBox);
  const longDescription = readStringValue(product.longDescription);
  const showLongDescription =
    !!longDescription &&
    longDescription.toLowerCase() !== descriptionText.toLowerCase();

  const detailSpecs = (() => {
    return combinedSpecs.slice(0, 6);
  })();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-start">

          {/* Left: Image */}
          <div className="bg-card rounded-3xl overflow-hidden shadow-lg self-start">
            <div className="h-[360px] sm:h-[460px] lg:h-[560px] max-h-[72vh]">
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
              {descriptionText || "No description available for this product."}
            </p>
            {featureBullets.length > 0 && (
              <ul className="space-y-2 text-sm text-foreground/70">
                {featureBullets.map((feature, idx) => (
                  <li
                    key={`${feature.slice(0, 12)}-${idx}`}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B95E82]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {detailSpecs.length > 0 && (
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/60">
                <h3 className="text-sm font-semibold text-foreground/70 mb-3">
                  Product Details
                </h3>
                <div className="space-y-3 text-sm">
                  {detailSpecs.map(
                    (spec: { label?: string; value?: string }, idx: number) => (
                      <div
                        key={`${spec.label}-${idx}`}
                        className="flex items-center justify-between gap-4 border-b border-border/40 pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="text-foreground/60">{spec.label}</span>
                        <span className="font-medium text-foreground text-right">
                          {spec.value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

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
          <div className="px-3 py-3 md:px-5 md:py-4 border-b border-border/40 bg-gradient-to-b from-[#FBF7F9] to-white">
            <div className="flex flex-wrap gap-2 md:gap-3">
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
                className={`relative px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-medium rounded-full transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-[#B95E82] shadow-[0_10px_20px_-12px_rgba(185,94,130,0.6)] border border-[#B95E82]/20"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/70 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
            </div>
          </div>

          <div className="p-6 md:p-8 text-foreground/70 leading-relaxed bg-white/70">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  About this product
                </h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  {descriptionText || "No description available for this product."}
                </p>
                {featureBullets.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-sm">
                    <h4 className="text-base font-semibold text-foreground">
                      Key Features
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                      {featureBullets.map((feature, idx) => (
                        <li
                          key={`${feature.slice(0, 12)}-${idx}`}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B95E82]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {whatIsInTheBox && (
                  <div className="rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-sm">
                    <h4 className="text-base font-semibold text-foreground">
                      What's in the box
                    </h4>
                    <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                      {whatIsInTheBox}
                    </p>
                  </div>
                )}
                {showLongDescription && (
                  <div className="rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-sm">
                    <h4 className="text-base font-semibold text-foreground">
                      More details
                    </h4>
                    <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                      {longDescription}
                    </p>
                  </div>
                )}
                <div className="rounded-2xl border border-dashed border-[#B95E82]/30 bg-[#FFF7FA] px-4 py-3 text-sm text-foreground/60">
                  Crafted to pair seamlessly with your wellness routine.
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              combinedSpecs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {combinedSpecs.map(
                    (spec: { label?: string; value?: string }, idx: number) => (
                      <div
                        key={`${spec.label}-${idx}`}
                        className="rounded-2xl border border-border/50 bg-white px-4 py-4 shadow-sm"
                      >
                        <div className="text-xs uppercase tracking-wide text-foreground/50">
                          {spec.label || "Spec"}
                        </div>
                        <div className="mt-2 text-base font-semibold text-foreground">
                          {spec.value || "—"}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 bg-white px-4 py-6 text-center text-sm text-foreground/60">
                  No specifications available.
                </div>
              )
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 text-sm">
                <div className="rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-sm">
                  <h4 className="text-base font-semibold text-foreground">
                    Shipping details
                  </h4>
                  <p className="mt-2 text-foreground/70 leading-relaxed">
                    {shippingInfo || "No shipping information available."}
                  </p>
                </div>
                {(processingSpec?.value || deliverySpec?.value) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {processingSpec?.value && (
                      <div className="rounded-2xl border border-border/50 bg-[#FFF7FA] px-4 py-3">
                        <div className="text-xs uppercase tracking-wide text-foreground/50">
                          {processingSpec.label || "Processing"}
                        </div>
                        <div className="mt-2 text-sm font-medium text-foreground">
                          {processingSpec.value}
                        </div>
                      </div>
                    )}
                    {deliverySpec?.value && (
                      <div className="rounded-2xl border border-border/50 bg-[#FFF7FA] px-4 py-3">
                        <div className="text-xs uppercase tracking-wide text-foreground/50">
                          {deliverySpec.label || "Delivery"}
                        </div>
                        <div className="mt-2 text-sm font-medium text-foreground">
                          {deliverySpec.value}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4 text-sm">
                {reviews.length > 0 ? (
                  reviews.map((review: any, idx: number) => {
                    const reviewerName = review.name || "Anonymous";
                    const initials = reviewerName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part: string) => part[0])
                      .join("")
                      .toUpperCase();
                    const ratingValue = Number(review.rating);
                    const clampedRating = Number.isFinite(ratingValue)
                      ? Math.max(0, Math.min(5, ratingValue))
                      : null;
                    return (
                      <div
                        key={`${review.name || "review"}-${idx}`}
                        className="rounded-2xl border border-border/50 bg-white px-5 py-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-[#F4E7EC] text-[#B95E82] font-semibold flex items-center justify-center">
                              {initials || "A"}
                            </div>
                            <div>
                              <p className="text-base font-semibold text-foreground">
                                {reviewerName}
                              </p>
                              {review.createdAt && (
                                <p className="text-xs text-foreground/50">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {clampedRating !== null && (
                              <div className="flex items-center gap-1 rounded-full bg-[#FFF7FA] px-3 py-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= clampedRating
                                        ? "text-[#f4b942] fill-current"
                                        : "text-[#e5e5e5]"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                        {review.comment && (
                          <p className="mt-3 text-foreground/70 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="rounded-2xl border border-dashed border-border/60 bg-white px-4 py-6 text-center text-foreground/60">
                      <p>No reviews yet.</p>
                      <p>Be the first to share your experience with this product.</p>
                    </div>
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
