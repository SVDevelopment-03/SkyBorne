"use client"
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

const mockCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME10', type: 'percentage', value: 10, expiryDate: '2026-03-31', usageLimit: 1000, usedCount: 247, active: true },
  { id: '2', code: 'SUMMER25', type: 'percentage', value: 25, expiryDate: '2026-06-30', usageLimit: 500, usedCount: 89, active: true },
  { id: '3', code: 'FREESHIP', type: 'fixed', value: 15, expiryDate: '2026-12-31', usageLimit: 2000, usedCount: 432, active: true },
  { id: '4', code: 'FLASH50', type: 'percentage', value: 50, expiryDate: '2026-02-15', usageLimit: 100, usedCount: 98, active: false },
];

export function Discounts() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; couponId: string | null }>({ show: false, couponId: null });
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    expiryDate: '',
    usageLimit: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: formData.code,
      type: formData.type,
      value: parseFloat(formData.value),
      expiryDate: formData.expiryDate,
      usageLimit: parseInt(formData.usageLimit),
      usedCount: 0,
      active: formData.active
    };
    setCoupons([...coupons, newCoupon]);
    setShowForm(false);
    setFormData({ code: '', type: 'percentage', value: '', expiryDate: '', usageLimit: '', active: true });
  };

  const handleDelete = () => {
    if (deleteModal.couponId) {
      setCoupons(coupons.filter(c => c.id !== deleteModal.couponId));
      setDeleteModal({ show: false, couponId: null });
    }
  };

  const toggleActive = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#333]">Discounts & Coupons</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#333] mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Coupon Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent uppercase"
                placeholder="SUMMER25"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Discount Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">
                Value * {formData.type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder={formData.type === 'percentage' ? '25' : '15.00'}
                step={formData.type === 'percentage' ? '1' : '0.01'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Expiry Date *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#707070] mb-2">Usage Limit *</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                placeholder="1000"
                required
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#B95E82] focus:ring-[#B95E82]"
                />
                <span className="text-sm font-medium text-[#707070]">Active</span>
              </label>
            </div>

            <div className="col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-[#707070] rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-[#333]">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-[#707070] capitalize">{coupon.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{coupon.expiryDate}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(coupon.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        coupon.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {coupon.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-[#707070]" />
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ show: true, couponId: coupon.id })}
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
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, couponId: null })}
        variant="danger"
      />
    </div>
  );
}
