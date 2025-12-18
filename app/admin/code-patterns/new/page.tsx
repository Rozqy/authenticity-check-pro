'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';

interface Brand {
  _id: string;
  name: string;
}

export default function NewCodePatternPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState({
    brand_id: '',
    pattern: '',
    is_genuine: true,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands');
      const data = await response.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/code-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: formData.brand_id,
          pattern: formData.pattern,
          is_genuine: formData.is_genuine,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/admin/code-patterns');
      } else {
        alert('Error creating pattern: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating pattern:', error);
      alert('Error creating pattern. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Code Pattern</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loadingBrands}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {loadingBrands && <p className="text-sm text-gray-500 mt-1">Loading brands...</p>}
              {!loadingBrands && brands.length === 0 && (
                <p className="text-sm text-yellow-600 mt-1">
                  No brands found. Please add a brand first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pattern *</label>
              <input
                type="text"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                placeholder="e.g., ABC123, ^[A-Z]{3}[0-9]{6}$"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter a code pattern. Can be a specific code or regex pattern.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pattern Type *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_genuine"
                    value="true"
                    checked={formData.is_genuine === true}
                    onChange={() => setFormData({ ...formData, is_genuine: true })}
                    className="mr-2"
                  />
                  <span className="text-green-700 font-medium">Genuine Pattern</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_genuine"
                    value="false"
                    checked={formData.is_genuine === false}
                    onChange={() => setFormData({ ...formData, is_genuine: false })}
                    className="mr-2"
                  />
                  <span className="text-red-700 font-medium">Fake Pattern</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes about this pattern..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || brands.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Pattern'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

