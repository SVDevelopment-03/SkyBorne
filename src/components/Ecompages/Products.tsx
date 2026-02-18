/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "@/store/api/productApi";
import type { Product } from "@/store/api/productApi";
import CustomPagination from "@/components/ui/CustromPagination";
import { Toggle2 } from "@/components/ui/Toggle2";
import toast from "react-hot-toast";

// ── Tooltip ────────────────────────────────────────────────────────
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="relative group inline-block w-full">
      {children}
      <div className="absolute z-50 bottom-full left-0 mb-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl pointer-events-none leading-relaxed">
        {text}
        <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

// ── Status Toggle ──────────────────────────────────────────────────
function StatusToggle({ product }: { product: Product }) {
  const [updateStatus, { isLoading }] = useUpdateProductStatusMutation();
  const [isActive, setIsActive] = useState(product.status === "active");

  const handleToggle = async () => {
    const newStatus = isActive ? "inactive" : "active";
    setIsActive(!isActive);
    try {
      await updateStatus({ productId: product._id, status: newStatus }).unwrap();
      toast.success(`Product status updated to ${newStatus}`);
    } catch {
      setIsActive(isActive);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Toggle2
        checked={isActive}
        onChange={handleToggle}
      />
      <span
        className={`text-sm font-medium ${
          isActive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export function Products() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    productId: string | null;
  }>({ show: false, productId: null });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    setPage(1);
    clearTimeout((window as any).__searchTimer);
    (window as any).__searchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const { data, isLoading, isFetching } = useGetProductsQuery({
    search: debouncedSearch,
    status: statusFilter,
    page,
    limit,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const products: Product[] = (data as any)?.data?.products ?? [];
  const totalPages: number = (data as any)?.data?.pagination?.totalPages ?? 1;

  const handleDelete = async () => {
    if (!deleteModal.productId) return;
    await deleteProduct(deleteModal.productId);
    toast.success("Product deleted successfully");
    setDeleteModal({ show: false, productId: null });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B95E82]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 px-3 py-6 md:p-6 bg-white rounded-lg overflow-x-hidden">

        {/* Header + Search */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#222]">Products</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your product catalog</p>
          </div>
          <Link
            href="/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors text-sm font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by name or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F2F0ED80] border border-[#DCE5E0] rounded-[10px] text-sm text-gray-700 placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#B95E82]/20 focus:border-[#B95E82] transition-colors h-11"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-11 px-4 bg-[#F2F0ED80] border border-[#DCE5E0] rounded-[10px] text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B95E82]/20 focus:border-[#B95E82] transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className={`w-full overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-400">No products found</p>
                        <p className="text-xs text-gray-300 mt-0.5">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                            alt={product.name}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                        <span className="font-medium text-[#000000]">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-[200px]">
                      {product.description ? (
                        <Tooltip text={product.description}>
                          <p className="font-medium text-[#000000] truncate cursor-default">
                            {product.description}
                          </p>
                        </Tooltip>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#000000]">
                        ${product.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusToggle product={product} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* <Link
                          href={`/products/${product._id}`}
                          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-[#000000]" />
                        </Link> */}
                        <Link
                          href={`/products/edit/${product._id}`}
                          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-[#000000]" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({ show: true, productId: product._id })
                          }
                          className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[#000000] hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="relative w-full pt-4">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent md:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />
            <div className="overflow-x-auto md:overflow-visible px-6">
              <div className="min-w-max md:min-w-0 flex justify-center">
                <CustomPagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  visiblePages={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.show}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, productId: null })}
        variant="danger"
      />
    </div>
  );
}