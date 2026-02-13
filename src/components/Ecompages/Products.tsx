"use client"
import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Published' | 'Draft';
  image: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Lavender Essential Oil', sku: 'LEO-001', category: 'Essential Oils', price: 24.99, stock: 45, status: 'Published', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108' },
  { id: '2', name: 'Yoga Mat Premium', sku: 'YMP-002', category: 'Wellness Equipment', price: 79.99, stock: 23, status: 'Published', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f' },
  { id: '3', name: 'Meditation Cushion', sku: 'MC-003', category: 'Wellness Equipment', price: 49.99, stock: 12, status: 'Published', image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7' },
  { id: '4', name: 'Herbal Tea Collection', sku: 'HTC-004', category: 'Wellness Products', price: 34.99, stock: 67, status: 'Published', image: 'https://images.unsplash.com/photo-1597318163218-9c8c7d4d1d8c' },
  { id: '5', name: 'Aromatherapy Diffuser', sku: 'AD-005', category: 'Accessories', price: 54.99, stock: 8, status: 'Draft', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59' },
];

export function Products() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; productId: string | null }>({ show: false, productId: null });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = () => {
    if (deleteModal.productId) {
      setProducts(products.filter(p => p.id !== deleteModal.productId));
      setDeleteModal({ show: false, productId: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#333]">Products</h1>
        <Link
          href="/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#707070]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            >
              <option value="all">All Categories</option>
              <option value="Essential Oils">Essential Oils</option>
              <option value="Wellness Equipment">Wellness Equipment</option>
              <option value="Wellness Products">Wellness Products</option>
              <option value="Accessories">Accessories</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-sm font-medium text-[#333]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${product.stock < 15 ? 'text-red-600' : 'text-[#333]'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-[#707070]" />
                      </button>
                      <Link href={`/products/edit/${product.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-[#707070]" />
                      </Link>
                      <button 
                        onClick={() => setDeleteModal({ show: true, productId: product.id })}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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