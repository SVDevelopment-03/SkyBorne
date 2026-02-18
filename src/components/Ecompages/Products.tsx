"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/api/productApi";
import type { Product } from "@/store/api/productApi";
import CustomPagination from "@/components/ui/CustromPagination";

export function Products() {
  // =============================
  // PAGINATION STATE (IMPORTANT)
  // =============================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // =============================
  // API CALLS
  // =============================
  const [deleteProduct] = useDeleteProductMutation();
  const { data, isLoading } = useGetProductsQuery(undefined);

  console.log("PRODUCT API RAW RESPONSE 👉", data);

  // =============================
  // BACKEND DATA MAPPING (CORRECT)
  // =============================
  const products: Product[] = [];
  const pagination = {};
  const totalPages =  1;

  // =============================
  // LOCAL STATE
  // =============================
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    productId: string | null;
  }>({ show: false, productId: null });

  // =============================
  // FILTER (ONLY UI FILTER)
  // =============================
  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =============================
  // DELETE HANDLER
  // =============================
  const handleDelete = async () => {
    if (!deleteModal.productId) return;
    await deleteProduct(deleteModal.productId);
    setDeleteModal({ show: false, productId: null });
  };

  // =============================
  // LOADING STATE
  // =============================
  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#333]">Products</h1>
        <Link
          href="/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F]"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // 🔥 SAME AS COUNTRY
              }}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1); // 🔥 reset page
            }}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  {product.name}
                </td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.status}</td>
                <td className="px-6 py-4 flex gap-2">
                  <Eye className="w-4 h-4" />
                  <Link href={`/products/edit/${product._id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Trash2
                    className="w-4 h-4 text-red-600 cursor-pointer"
                    onClick={() =>
                      setDeleteModal({ show: true, productId: product._id })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* =============================
            PAGINATION (SAME AS COUNTRY)
        ============================= */}
        {totalPages > 1 && (
          <div className="pt-6 flex justify-center">
            <CustomPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
              visiblePages={3}
            />
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        title="Delete Product"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, productId: null })}
        variant="danger"
      />
    </div>
  );
}
