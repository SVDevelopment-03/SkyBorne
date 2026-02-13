export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Yoga' | 'Accessories' | 'Apparel';
  longDescription: string;
  specifications: string[];
  shippingInfo: string;
  reviews: Review[];
  relatedProducts?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Yoga Mat',
    description: 'Eco-friendly, non-slip surface for your practice',
    price: 89,
    image: 'yoga-mat-studio',
    category: 'Yoga',
    longDescription: 'Experience unparalleled comfort and stability with our Premium Yoga Mat. Crafted from sustainable materials, this mat provides the perfect foundation for your daily practice. The textured surface ensures superior grip even during the most challenging poses.',
    specifications: [
      'Dimensions: 72" x 24" x 6mm',
      'Material: Natural rubber & microfiber',
      'Weight: 4.5 lbs',
      'Eco-friendly and biodegradable',
      'Non-toxic, latex-free'
    ],
    shippingInfo: 'Free shipping on orders over $75. Arrives in 3-5 business days.',
    reviews: [
      { id: 'r1', author: 'Sarah M.', rating: 5, comment: 'Best yoga mat I\'ve ever owned. The grip is incredible!', date: '2026-01-15' },
      { id: 'r2', author: 'James K.', rating: 5, comment: 'Worth every penny. So comfortable and stable.', date: '2026-01-22' }
    ],
    relatedProducts: ['2', '4', '6']
  },
  {
    id: '2',
    name: 'Resistance Band Set',
    description: 'Complete set with 5 resistance levels',
    price: 39,
    image: 'resistance-bands-fitness',
    category: 'Accessories',
    longDescription: 'Transform your workout with our versatile Resistance Band Set. Includes five different resistance levels to match your fitness journey. Perfect for strength training, physical therapy, and stretching routines.',
    specifications: [
      'Set includes: 5 bands (5-50 lbs resistance)',
      'Material: Premium latex',
      'Includes door anchor and carry bag',
      'Color-coded for easy selection',
      'Suitable for all fitness levels'
    ],
    shippingInfo: 'Ships within 24 hours. Standard shipping 3-5 business days.',
    reviews: [
      { id: 'r3', author: 'Emily R.', rating: 5, comment: 'Great quality and variety. Use them every day!', date: '2026-02-01' },
      { id: 'r4', author: 'Michael T.', rating: 4, comment: 'Excellent value for the price.', date: '2026-02-05' }
    ],
    relatedProducts: ['1', '3', '6']
  },
  {
    id: '3',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 24oz bottle keeps drinks cold for 24 hours',
    price: 29,
    image: 'water-bottle-stainless',
    category: 'Accessories',
    longDescription: 'Stay hydrated in style with our premium insulated water bottle. Double-wall vacuum insulation keeps your beverages at the perfect temperature all day long. The sleek design complements your wellness lifestyle.',
    specifications: [
      'Capacity: 24 oz (710 ml)',
      'Material: 18/8 stainless steel',
      'BPA-free and non-toxic',
      'Keeps cold for 24 hours, hot for 12 hours',
      'Leak-proof cap with carry loop'
    ],
    shippingInfo: 'Fast shipping available. Delivered in 2-4 business days.',
    reviews: [
      { id: 'r5', author: 'Lisa W.', rating: 5, comment: 'Love the design and it keeps water ice cold!', date: '2026-01-28' },
      { id: 'r6', author: 'David P.', rating: 5, comment: 'Perfect size and very durable.', date: '2026-02-03' }
    ],
    relatedProducts: ['2', '5', '1']
  },
  {
    id: '4',
    name: 'Meditation Cushion',
    description: 'Organic cotton cushion with buckwheat hull fill',
    price: 79,
    image: 'meditation-cushion-zen',
    category: 'Yoga',
    longDescription: 'Elevate your meditation practice with our handcrafted Meditation Cushion. Filled with organic buckwheat hulls that conform to your body, providing optimal support for extended sitting sessions. The beautiful design adds serenity to any space.',
    specifications: [
      'Dimensions: 16" diameter x 6" height',
      'Cover: 100% organic cotton',
      'Fill: Organic buckwheat hulls',
      'Removable, washable cover',
      'Handmade with care'
    ],
    shippingInfo: 'Free shipping. Arrives in 4-6 business days.',
    reviews: [
      { id: 'r7', author: 'Sophia L.', rating: 5, comment: 'So comfortable for long meditation sessions.', date: '2026-01-20' },
      { id: 'r8', author: 'Noah C.', rating: 5, comment: 'Beautiful craftsmanship and very supportive.', date: '2026-01-25' }
    ],
    relatedProducts: ['1', '5', '3']
  },
  {
    id: '5',
    name: 'Wellness Journal',
    description: 'Guided journal for mindfulness and gratitude',
    price: 24,
    image: 'journal-wellness-notebook',
    category: 'Accessories',
    longDescription: 'Document your wellness journey with our beautifully designed Wellness Journal. Featuring guided prompts for gratitude, mindfulness, and self-reflection, this journal helps you cultivate a more intentional and peaceful life.',
    specifications: [
      'Pages: 180 pages (90 sheets)',
      'Paper: Premium acid-free cream paper',
      'Size: 8.5" x 6"',
      'Binding: Lay-flat binding',
      'Cover: Vegan leather with rose gold foil'
    ],
    shippingInfo: 'Ships next business day. Standard delivery 3-5 days.',
    reviews: [
      { id: 'r9', author: 'Olivia H.', rating: 5, comment: 'The prompts are so thoughtful and inspiring.', date: '2026-02-07' },
      { id: 'r10', author: 'Ethan B.', rating: 4, comment: 'Great quality journal, love the layout.', date: '2026-02-09' }
    ],
    relatedProducts: ['4', '3', '1']
  },
  {
    id: '6',
    name: 'Skyborne Activewear Set',
    description: 'Sustainable leggings and sports bra set',
    price: 129,
    image: 'activewear-women-athletic',
    category: 'Apparel',
    longDescription: 'Move with confidence in our signature Activewear Set. Made from recycled materials with moisture-wicking technology, this set combines style, comfort, and sustainability. Perfect for yoga, running, or any activity.',
    specifications: [
      'Material: 79% recycled polyester, 21% spandex',
      'Features: 4-way stretch, moisture-wicking',
      'Sizes: XS - XL available',
      'Leggings: High-waisted with phone pocket',
      'Sports bra: Medium support with removable pads'
    ],
    shippingInfo: 'Free shipping and returns. Delivered in 3-5 business days.',
    reviews: [
      { id: 'r11', author: 'Ava S.', rating: 5, comment: 'Most comfortable activewear I own!', date: '2026-01-18' },
      { id: 'r12', author: 'Isabella M.', rating: 5, comment: 'Love that it\'s sustainable and looks amazing.', date: '2026-01-30' }
    ],
    relatedProducts: ['1', '2', '3']
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getRelatedProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product || !product.relatedProducts) return [];
  return product.relatedProducts
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined);
};
