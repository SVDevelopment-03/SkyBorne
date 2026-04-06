/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Search, AlertTriangle, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import CustomPagination from "@/components/ui/CustromPagination";
import toast from "react-hot-toast";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  type Product,
} from "@/store/api/productApi";

const LOW_STOCK_THRESHOLD = 10;

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    search: debouncedSearch,
    page,
    limit,
  });

  const products: Product[] = (data as any)?.data?.products ?? [];
  const totalPages: number = (data as any)?.data?.pagination?.totalPages ?? 1;

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (id: string, currentStock: number | undefined) => {
    setEditingId(id);
    setEditValue(String(currentStock ?? 0));
  };

  const handleUpdate = async (id: string) => {
    const parsed = Number(editValue);
    if (!Number.isInteger(parsed) || parsed < 0) {
      toast.error("Stock must be a non-negative integer");
      return;
    }

    try {
      await updateProduct({ productId: id, stock: parsed }).unwrap();
      toast.success("Stock updated successfully");
      setEditingId(null);
      setEditValue("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update stock");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Inventory Management</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#B95E82] animate-spin" />
            <span className="ml-3 text-[#707070]">Loading inventory...</span>
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockValue = product.stock ?? 0;
                    const isLowStock = stockValue < LOW_STOCK_THRESHOLD;
                    const isEditing = editingId === product._id;
                    const sku = product._id?.slice(-6).toUpperCase();

                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#333]">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-[#707070]">{sku}</td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-24 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                              autoFocus
                            />
                          ) : (
                            <span className={`text-sm font-medium ${isLowStock ? "text-red-600" : "text-[#333]"}`}>
                              {stockValue}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isLowStock && (
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-xs font-medium">Low Stock</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(product._id)}
                                disabled={isUpdating}
                                className="px-4 py-1 bg-[#B95E82] text-white rounded-lg hover:bg-[#A04D6F] transition-colors text-sm"
                              >
                                {isUpdating ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancel}
                                className="px-4 py-1 border border-gray-300 text-[#707070] rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(product._id, stockValue)}
                              className="px-4 py-1 bg-gray-100 text-[#707070] rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              Update Stock
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="mt-6">
                <CustomPagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
