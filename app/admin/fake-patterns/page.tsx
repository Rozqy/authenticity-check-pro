'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

interface FakePattern {
  _id: string;
  brand_id: {
    _id: string;
    name: string;
  };
  pattern: string;
  fake_signs: string[];
  risk_level: 'low' | 'medium' | 'high';
}

export default function AdminFakePatternsPage() {
  const [patterns, setPatterns] = useState<FakePattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const response = await fetch('/api/admin/fake-patterns');
      const data = await response.json();
      if (data.success) {
        setPatterns(data.patterns);
      }
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fake Patterns</h1>
            <p className="text-gray-600 mt-1">Manage known fake product patterns</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Fake Pattern
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pattern</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fake Signs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : patterns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No fake patterns found</td>
                </tr>
              ) : (
                patterns.map((pattern) => (
                  <tr key={pattern._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {pattern.brand_id?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {pattern.pattern}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(pattern.risk_level)}`}>
                        {pattern.risk_level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {pattern.fake_signs.slice(0, 2).map((sign, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded">
                            {sign}
                          </span>
                        ))}
                        {pattern.fake_signs.length > 2 && (
                          <span className="px-2 py-1 text-xs text-gray-500">+{pattern.fake_signs.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <a href="#" className="text-blue-600 hover:underline">Edit</a>
                        <a href="#" className="text-red-600 hover:underline">Delete</a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




