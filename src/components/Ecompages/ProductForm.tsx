/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { useCreateProductMutation } from "@/store/api/productApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import toast from "react-hot-toast";
import { Toggle2 } from "../ui/Toggle2";

interface FormErrors {
  title?: string;
  category?: string;
  price?: string;
  stock?: string;
  image?: string;
}
  const InputError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

export function ProductForm() {
  const router = useRouter();
  const [addProduct, { isLoading }] = useCreateProductMutation();
  const { data: serviceData, isLoading: servicesLoading } = useGetServicesQuery(undefined);

  console.log("servicew data ", serviceData);
  



  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 1,
    stock: 1,
    status: "inactive" as "active" | "inactive",
  });

  // ========================
  // VALIDATION
  // ========================
  const validate = (requireImage = false): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product name is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.price || formData.price < 1) {
      newErrors.price = "Price must be at least $1";
    }
    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }
    if (requireImage && !imageBase64) {
      newErrors.image = "Please upload a product image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================
  // SUBMIT
  // ========================
  const handleSubmit = async (action: "draft" | "publish") => {
    const requireImage = action === "publish";
    if (!validate(requireImage)) return;

    try {
      const payload = {
        name: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        price: formData.price,
        stock: formData.stock,
        imageBase64,
      };

      await addProduct(payload as any).unwrap();

      toast.success(
        formData.status === "active"
          ? "Product published successfully"
          : "Product created as inactive"
      );
      router.push("/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save product");
      console.error("ADD PRODUCT ERROR:", error);
    }
  };

  const handleChange = (
    e: any  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setImagePreview(null);
      setImageBase64(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageBase64(reader.result as string);
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/products")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#707070]" />
        </button>
        <h1 className="text-3xl font-bold text-[#333]">Add New Product</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-2 lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333]">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] ${
                  errors.title ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Enter product name"
              />
              <InputError msg={errors.title} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] ${
                  errors.category ? "border-red-400" : "border-gray-200"
                }`}
              >
                <option value="">Select category</option>
                {servicesLoading ? (
                  <option disabled>Loading...</option>
                ) : Array.isArray(serviceData?.data) ? (
                  serviceData?.data?.map((service: any) => (
                    <option key={service._id} value={service._id}>
                      {service.title}
                    </option>
                  ))
                ) : null}
              </select>
              <InputError msg={errors.category} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] resize-none"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333]">Pricing</h2>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] ${
                    errors.price ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="0"
                  min={1}
                  step={1}
                />
              </div>
              <InputError msg={errors.price} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 lg:col-span-1 space-y-6">
          {/* Inventory */}
          {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333]">Inventory</h2>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] ${
                  errors.stock ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="0"
                min={0}
                step={1}
              />
              <InputError msg={errors.stock} />
            </div>
          </div> */}

          {/* Product Image */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333]">Product Image</h2>
            <input
              type="file"
              accept="image/*"
              hidden
              id="imageUpload"
              onChange={handleImageChange}
            />
            <label htmlFor="imageUpload">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition ${
                  errors.image ? "border-red-400" : "border-gray-300"
                }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 mx-auto object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {imagePreview ? "Click to change image" : "Click to upload image"}
                </p>
              </div>
            </label>
            <InputError msg={errors.image} />
          </div>

          {/* Status Toggle */}
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
  <Toggle2
    checked={formData.status === "active"}
    onChange={(val) =>
      setFormData((prev) => ({
        ...prev,
        status: val ? "active" : "inactive",
      }))
    }
    label="Product Status"
    description={
      formData.status === "active"
        ? "Product is visible to user"
        : "Product is hidden from the user"
    }
  />
</div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-2 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-6 py-3 border border-gray-300 text-[#707070] rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {/* <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 text-[#707070] rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button> */}
          <button
            type="button"
            onClick={() => handleSubmit("publish")}
            disabled={isLoading}
            className="px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
