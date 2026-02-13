"use client"
import { useState } from 'react';
import { Globe } from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  flatRate: number;
  freeShippingThreshold: number;
  estimatedDays: string;
}

const mockZones: ShippingZone[] = [
  { id: '1', name: 'United States', flatRate: 8.99, freeShippingThreshold: 75, estimatedDays: '3-5 business days' },
  { id: '2', name: 'Canada', flatRate: 12.99, freeShippingThreshold: 100, estimatedDays: '5-7 business days' },
];

export function Shipping() {
  const [zones, setZones] = useState(mockZones);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<ShippingZone | null>(null);

  const handleEdit = (zone: ShippingZone) => {
    setEditingId(zone.id);
    setEditData({ ...zone });
  };

  const handleSave = () => {
    if (editData && editingId) {
      setZones(zones.map(z => z.id === editingId ? editData : z));
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Shipping Settings</h1>

      <div className="space-y-4">
        {zones.map((zone) => {
          const isEditing = editingId === zone.id;
          const currentData = isEditing && editData ? editData : zone;

          return (
            <div key={zone.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#B95E82] bg-opacity-10 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#B95E82]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#333]">{zone.name}</h2>
                  <p className="text-sm text-[#707070]">Shipping zone configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#707070] mb-2">Flat Rate Shipping</label>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]">$</span>
                      <input
                        type="number"
                        value={currentData.flatRate}
                        onChange={(e) => setEditData({ ...currentData, flatRate: parseFloat(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                        step="0.01"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#333]">${zone.flatRate.toFixed(2)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#707070] mb-2">Free Shipping Threshold</label>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]">$</span>
                      <input
                        type="number"
                        value={currentData.freeShippingThreshold}
                        onChange={(e) => setEditData({ ...currentData, freeShippingThreshold: parseFloat(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                        step="1"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#333]">${zone.freeShippingThreshold.toFixed(2)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#707070] mb-2">Estimated Delivery</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.estimatedDays}
                      onChange={(e) => setEditData({ ...currentData, estimatedDays: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg font-medium text-[#707070] mt-2">{zone.estimatedDays}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-[#707070] rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(zone)}
                    className="px-6 py-2 bg-gray-100 text-[#707070] rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Edit Zone
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">Shipping Information</h3>
        <p className="text-sm text-blue-800">
          Flat rate shipping applies to all orders. Orders meeting or exceeding the free shipping threshold will automatically receive free shipping. Delivery estimates are provided to customers at checkout.
        </p>
      </div>
    </div>
  );
}
