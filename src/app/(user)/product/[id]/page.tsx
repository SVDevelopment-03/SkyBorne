// app/product/[id]/page.tsx

import ProductDetailPage from '@/components/pages/user/ProductDetailPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailPage params={{ id }} />
}