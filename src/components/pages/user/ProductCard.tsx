import Link from 'next/link';
import { ImageWithFallback } from './ImageWithFallback';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface BackendProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: { _id: string; title: string } | string;
  status: string;
  createdAt?: string;
}

interface ProductCardProps {
  product: BackendProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/product/${product._id}`} className="h-full">
      <div
        className={`bg-card rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
          isHovered ? 'shadow-xl -translate-y-2' : 'shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-1">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-serif text-primary">${product.price}</p>
            <Button
              variant={"theme"}
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic would go here
              }}
              className="px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}