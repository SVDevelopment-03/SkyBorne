/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/api/productApi";
import { useGetActiveEcomCategoriesQuery } from "@/store/api/categoryApi";
import toast from "react-hot-toast";
import { Toggle2 } from "@/components/ui/Toggle2";
import {
  EMPTY_PRODUCT_MASTER_DATA,
  PRODUCT_MASTER_GROUPS,
  ProductMasterData,
} from "./productMasterFields";

interface FormErrors {
  title?: string;
  category?: string;
  price?: string;
  image?: string;
}

const InputError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

type SpecificationInput = { label: string; value: string };
type ReviewInput = { name: string; rating: number; comment: string };
type ImageItem = { id: string; preview: string; base64?: string; url?: string };

interface EditProductFormProps {
  productId: string;
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categoryData, isLoading: categoriesLoading } =
    useGetActiveEcomCategoriesQuery();
  const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(productId);

  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [masterData, setMasterData] = useState<ProductMasterData>(
    EMPTY_PRODUCT_MASTER_DATA
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 1,
    status: "inactive" as "active" | "inactive",
    specifications: [] as SpecificationInput[],
    shippingInfo: "",
    reviews: [] as ReviewInput[],
  });

  // Populate form when product data loads
  useEffect(() => {
    if (productData) {
      const p = (productData as any)?.data ?? productData;
      setFormData({
        title: p.name ?? "",
        description: p.description ?? "",
        category: p.category?._id ?? p.category ?? "",
        price: p.price ?? 1,
        status: p.status ?? "inactive",
        specifications: Array.isArray(p.specifications) ? p.specifications : [],
        shippingInfo: p.shippingInfo ?? "",
        reviews: Array.isArray(p.reviews) ? p.reviews : [],
      });
      const imageUrls = Array.isArray(p.images) && p.images.length
        ? p.images
        : p.image
        ? [p.image]
        : [];
      const cappedUrls = imageUrls.slice(0, 5);
      if (imageUrls.length > 5) {
        toast.error("Only the first 5 images are shown");
      }
      setImageItems(
        cappedUrls.map((url: string, index: number) => ({
          id: `existing-${index}`,
          preview: url,
          url,
        }))
      );
      const nextMasterData: ProductMasterData = { ...EMPTY_PRODUCT_MASTER_DATA };
      PRODUCT_MASTER_GROUPS.forEach((group) => {
        group.fields.forEach((field) => {
          nextMasterData[field.key] =
            typeof p[field.key] === "string" ? p[field.key] : "";
        });
      });
      setMasterData(nextMasterData);
    }
  }, [productData]);

  // ========================
  // VALIDATION
  // ========================
  const validate = (): boolean => {
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
    if (imageItems.length === 0) {
      newErrors.image = "Please upload at least one product image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================
  // SUBMIT
  // ========================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const cleanedSpecifications = formData.specifications
        .map((spec) => ({
          label: spec.label.trim(),
          value: spec.value.trim(),
        }))
        .filter((spec) => spec.label || spec.value);

      const cleanedReviews = formData.reviews
        .map((review) => ({
          name: review.name.trim(),
          rating: Number(review.rating) || 0,
          comment: review.comment.trim(),
        }))
        .filter((review) => review.name || review.comment || review.rating);

      const masterPayload = PRODUCT_MASTER_GROUPS.reduce(
        (acc, group) => {
          group.fields.forEach((field) => {
            acc[field.key] = masterData[field.key];
          });
          return acc;
        },
        {} as Partial<ProductMasterData>
      );

      const payload: any = {
        productId,
        name: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        price: formData.price,
        specifications: cleanedSpecifications,
        shippingInfo: formData.shippingInfo,
        reviews: cleanedReviews,
        ...masterPayload,
      };

      const imageBase64s = imageItems
        .filter((item) => item.base64)
        .map((item) => item.base64 as string);
      const imageUrls = imageItems
        .filter((item) => item.url)
        .map((item) => item.url as string);
      payload.imageBase64s = imageBase64s;
      payload.imageUrls = imageUrls;

      await updateProduct(payload).unwrap();
      toast.success("Product updated successfully");
      router.push("/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product");
      console.error("UPDATE PRODUCT ERROR:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMasterChange = (
    key: keyof ProductMasterData,
    value: string
  ) => {
    setMasterData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - imageItems.length;
    if (remainingSlots <= 0) {
      setErrors((prev) => ({
        ...prev,
        image: "Maximum 5 images allowed",
      }));
      return;
    }

    const filesToRead = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setErrors((prev) => ({
        ...prev,
        image: "Only the first 5 images were added",
      }));
    }
    const readAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

    try {
      const dataUrls = await Promise.all(filesToRead.map(readAsDataUrl));
      const newItems: ImageItem[] = dataUrls.map((dataUrl, index) => ({
        id: `${Date.now()}-${index}`,
        preview: dataUrl,
        base64: dataUrl,
      }));
      setImageItems((prev) => [...prev, ...newItems]);
      setErrors((prev) => ({ ...prev, image: undefined }));
    } catch (err) {
      console.error("Failed to read images:", err);
      toast.error("Failed to read one or more images");
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImageItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const updateSpecification = (index: number, field: "label" | "value", value: string) => {
    setFormData((prev) => {
      const next = [...prev.specifications];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, specifications: next };
    });
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addReview = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, { name: "", rating: 5, comment: "" }],
    }));
  };

  const updateReview = (
    index: number,
    field: "name" | "rating" | "comment",
    value: string
  ) => {
    setFormData((prev) => {
      const next = [...prev.reviews];
      next[index] = {
        ...next[index],
        [field]: field === "rating" ? Number(value) : value,
      };
      return { ...prev, reviews: next };
    });
  };

  const removeReview = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B95E82]" />
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-[#333]">Edit Product</h1>
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
                {categoriesLoading ? (
                  <option disabled>Loading...</option>
                ) : Array.isArray(categoryData?.data) ? (
                  categoryData?.data?.map((category: any) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
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

          {/* Product Master Data */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-[#333]">Product Master Data</h2>
            {PRODUCT_MASTER_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-[#333]">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-[#707070] mb-2">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={field.rows ?? 3}
                          value={masterData[field.key]}
                          onChange={(e) => handleMasterChange(field.key, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] resize-none"
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={masterData[field.key]}
                          onChange={(e) => handleMasterChange(field.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82]"
                        >
                          <option value="">
                            {field.placeholder || `Select ${field.label.toLowerCase()}`}
                          </option>
                          {(field.options || []).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={masterData[field.key]}
                          onChange={(e) => handleMasterChange(field.key, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82]"
                        />
                      )}
                      {field.helper ? (
                        <p className="text-xs text-gray-400 mt-1">{field.helper}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#333]">Specifications</h2>
              <button
                type="button"
                onClick={addSpecification}
                className="text-sm font-medium text-[#B95E82] hover:text-[#A04D6F] transition-colors"
              >
                Add Spec
              </button>
            </div>

            {formData.specifications.length === 0 ? (
              <p className="text-sm text-[#707070]">No specifications added.</p>
            ) : (
              <div className="space-y-3">
                {formData.specifications.map((spec, idx) => (
                  <div
                    key={`spec-${idx}`}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
                  >
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => updateSpecification(idx, "label", e.target.value)}
                      placeholder="Label"
                      className="md:col-span-2 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82]"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(idx, "value", e.target.value)}
                      placeholder="Value"
                      className="md:col-span-2 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(idx)}
                      className="text-sm text-red-600 hover:text-red-700 md:justify-self-end"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-[#333]">Shipping Info</h2>
            <textarea
              name="shippingInfo"
              value={formData.shippingInfo}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] resize-none"
              placeholder="Enter shipping information"
            />
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#333]">Reviews</h2>
              <button
                type="button"
                onClick={addReview}
                className="text-sm font-medium text-[#B95E82] hover:text-[#A04D6F] transition-colors"
              >
                Add Review
              </button>
            </div>

            {formData.reviews.length === 0 ? (
              <p className="text-sm text-[#707070]">No reviews added.</p>
            ) : (
              <div className="space-y-4">
                {formData.reviews.map((review, idx) => (
                  <div
                    key={`review-${idx}`}
                    className="border border-gray-100 rounded-xl p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <input
                        type="text"
                        value={review.name}
                        onChange={(e) => updateReview(idx, "name", e.target.value)}
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82]"
                      />
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        value={review.rating}
                        onChange={(e) => updateReview(idx, "rating", e.target.value)}
                        placeholder="Rating"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82]"
                      />
                      <button
                        type="button"
                        onClick={() => removeReview(idx)}
                        className="text-sm text-red-600 hover:text-red-700 md:justify-self-end"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={review.comment}
                      onChange={(e) => updateReview(idx, "comment", e.target.value)}
                      placeholder="Comment"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 lg:col-span-1 space-y-6">
          {/* Product Image */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#333]">Product Images</h2>
              <span className="text-xs text-[#707070]">
                {imageItems.length}/5
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              id="imageUpload"
              onChange={handleImageChange}
              multiple
            />
            <label htmlFor="imageUpload">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition ${
                  errors.image ? "border-red-400" : "border-gray-300"
                }`}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload images (max 5)
                </p>
              </div>
            </label>
            {imageItems.length > 0 ? (
              <div className="space-y-3">
                {imageItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <img
                      src={item.preview}
                      alt="Preview"
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-md shadow"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
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
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating}
            className="px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProductForm;
