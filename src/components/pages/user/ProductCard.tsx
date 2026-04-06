import { ImageWithFallback } from './ImageWithFallback';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackendProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: { _id: string; title: string } | string;
  stock?: number;
  status: string;
  createdAt?: string;
}

interface ProductCardProps {
  product: BackendProduct;
  onAddToCart?: (productId: string) => void;
  isAddingToCart?: boolean;
  onInterested?: (productId: string) => void;
  isInterested?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  isAddingToCart = false,
  onInterested,
  isInterested = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const isOutOfStock =
    typeof product.stock === "number" ? product.stock <= 0 : false;

  return (
    <div
      className={`bg-card rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col border border-border/60 cursor-pointer ${
        isHovered ? 'shadow-xl -translate-y-1' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        // Ignore card navigation if click comes from Add to Cart button area
        if (target.closest('[data-no-nav="true"]')) return;
        router.push(`/product/${product._id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/product/${product._id}`);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details of ${product.name}`}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-background/30 flex-shrink-0">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2 min-h-10 flex-1">
          {product.description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-2xl font-serif text-primary">${product.price}</p>
          <div data-no-nav="true">
            {isOutOfStock ? (
              <Button
                type="button"
                variant="outlineBlack"
                disabled={isInterested}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onInterested?.(product._id);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isInterested ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Interested"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="theme"
                disabled={isAddingToCart}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart?.(product._id);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
