'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';

interface Brand {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  tags: string[];
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('A-Z');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data.brands || []))
      .catch(err => console.error(err));
  }, []);

  const filteredBrands = brands
    .filter(brand => 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === 'All' || brand.tags.includes(category))
    )
    .sort((a, b) => {
      if (sortBy === 'A-Z') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const brandColors = [
    'bg-orange-100',
    'bg-teal-100',
    'bg-yellow-100',
    'bg-green-100',
    'bg-green-100',
    'bg-green-100',
    'bg-amber-100',
    'bg-green-100',
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Partnered Brands</h1>
          <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-8">Find official verification guidelines from our trusted partners.</p>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for a brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="A-Z">Sort by: A-Z</option>
              <option value="Z-A">Sort by: Z-A</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">Category: All</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Fragrances">Fragrances</option>
              <option value="Beverages">Beverages</option>
              <option value="Skincare">Skincare</option>
            </select>
          </div>

          {/* Brand Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <div key={brand._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`${brandColors[index % brandColors.length]} h-32 flex items-center justify-center`}>
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-2xl font-bold text-gray-600">{brand.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{brand.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>
                    <a
                      href={`/brands/${brand._id}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View Verification Guidelines
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No brands found. Check back later or contact support.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}




