// app/products/edit/[productId]/page.tsx

import EditProductForm from "@/components/Ecompages/EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
  const  data = await params;
  console.log("product data", data);
  
  return <EditProductForm productId={data?.id} />;
}