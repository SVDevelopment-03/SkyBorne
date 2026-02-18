"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useCreateProductMutation } from "@/store/api/productApi";
import toast from "react-hot-toast";

export function ProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = Boolean(id);

  const [addProduct, { isLoading }] = useCreateProductMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview URL
  const [imageBase64, setImageBase64] = useState<string | null>(null);   // Base64 string

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: 0,
    salePrice: 0,
    sku: "",
    stock: 0,
    weight: 0,
    image: "",
    status: "Draft" as "Draft" | "Published",
  });

  const handleSubmit = async (
    e: React.FormEvent,
    action: "draft" | "publish"
  ) => {
    e.preventDefault();

    // if (!formData.title || !formData.category || !formData.sku || !formData.price || !imageBase64) {
    //   toast.error("Required fields missing");
    //   return;
    // }

    try {
     const payload = {
        name: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        sku: formData.sku,
        status: action === "publish" ? "Published" : "Draft",
        price: formData.price,
        salePrice: formData.salePrice,
        stock: formData.stock,
        weight: formData.weight,
        imageBase64, // base64 string
      };
      
      if (!imageBase64 && action === "publish") {
        toast.error("Please select product image");
        return;
      }

      // console.log("Submitting payload with FormData:", payload);
      // for (let pair of payload.entries()) {
      //   console.log(pair[0], ":", pair[1]);
      // }

      await addProduct(payload as any).unwrap(); // Redux query / mutation

      toast.success(
        action === "publish"
          ? "Product published successfully"
          : "Product saved as draft"
      );

      router.push("/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save product");
      console.error("ADD PRODUCT ERROR:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImageUploaded(false);

    if (!file) {
      setImagePreview(null);
      setImageBase64(null);
      return;
    }

    // Preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string); // Preview ke liye
      setImageBase64(reader.result as string);  // Backend me base64 ke liye
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/products')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#707070]" />
        </button>
        <h1 className="text-3xl font-bold text-[#333]">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form className="grid grid-cols-2 gap-6">
        <div className="col-span-2 lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333] mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Product Name *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder="product-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="64f1a2b3c4d5e6f7a8b9c0d1">Essential Oils</option>
                <option value="64f1a2b3c4d5e6f7a8b9c0d1">Wellness Equipment</option>
                <option value="64f1a2b3c4d5e6f7a8b9c0d1">Wellness Products</option>
                <option value="64f1a2b3c4d5e6f7a8b9c0d1">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent resize-none"
                placeholder="Enter product description"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333] mb-4">Pricing</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#707070] mb-2">Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#707070] mb-2">Sale Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]">$</span>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333] mb-4">Inventory</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder="SKU-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder="0.0"
                step="0.01"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333] mb-4">Product Images</h2>
              <input
                type="file"
                accept="image/*"
                hidden
                id="imageUpload"
                onChange={handleImageChange}
              />

              <label htmlFor="imageUpload">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 mx-auto object-cover rounded-lg"
                    />
                  ) : imageUploaded ? (
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 animate-bounce" />
                  ) : (
                    <Upload className="w-12 h-12 mx-auto" />
                  )}
                  <p>{imagePreview ? "Preview" : imageUploaded ? "Image uploaded!" : "Click to upload image"}</p>
                </div>
              </label>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div>
                <p className="font-medium text-[#333]">Publish Product</p>
                <p className="text-sm text-[#707070]">Make this product visible in the store</p>
              </div>
            </label>
          </div>
        </div>

        <div className="col-span-2 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="px-6 py-3 border border-gray-300 text-[#707070] rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            className="px-6 py-3 bg-gray-200 text-[#707070] rounded-xl hover:bg-gray-300 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'publish')}
            className="px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors"
          >
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}