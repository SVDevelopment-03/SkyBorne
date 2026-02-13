"use client"
import { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Lavender Essential Oil', sku: 'LEO-001', currentStock: 45, lowStockThreshold: 20 },
  { id: '2', name: 'Yoga Mat Premium', sku: 'YMP-002', currentStock: 23, lowStockThreshold: 15 },
  { id: '3', name: 'Meditation Cushion', sku: 'MC-003', currentStock: 12, lowStockThreshold: 15 },
  { id: '4', name: 'Herbal Tea Collection', sku: 'HTC-004', currentStock: 67, lowStockThreshold: 25 },
  { id: '5', name: 'Aromatherapy Diffuser', sku: 'AD-005', currentStock: 8, lowStockThreshold: 10 },
  { id: '6', name: 'Organic Face Serum', sku: 'OFS-006', currentStock: 34, lowStockThreshold: 20 },
  { id: '7', name: 'Bamboo Water Bottle', sku: 'BWB-007', currentStock: 5, lowStockThreshold: 15 },
  { id: '8', name: 'Wellness Journal', sku: 'WJ-008', currentStock: 89, lowStockThreshold: 30 },
];

export function Inventory() {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string, currentStock: number) => {
    setEditingId(id);
    setEditValue(currentStock.toString());
  };

  const handleUpdate = (id: string) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, currentStock: parseInt(editValue) || 0 } : item
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {filteredInventory.map((item) => {
                const isLowStock = item.currentStock < item.lowStockThreshold;
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#333]">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-[#707070]">{item.sku}</td>
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
                        <span className={`text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-[#333]'}`}>
                          {item.currentStock}
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
                            onClick={() => handleUpdate(item.id)}
                            className="px-4 py-1 bg-[#B95E82] text-white rounded-lg hover:bg-[#A04D6F] transition-colors text-sm"
                          >
                            Save
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
                          onClick={() => handleEdit(item.id, item.currentStock)}
                          className="px-4 py-1 bg-gray-100 text-[#707070] rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
