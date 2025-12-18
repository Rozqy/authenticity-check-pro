'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'image' | 'code' | 'brand'>('code');
  
  const result = searchParams.get('result') || 'pending';
  const score = parseInt(searchParams.get('score') || '0');
  const method = searchParams.get('method') || 'code';
  
  // Get actual data from URL params
  const brand = searchParams.get('brand') || '';
  const batchNumber = searchParams.get('batchNumber') || '';
  const serialNumber = searchParams.get('serialNumber') || '';
  const barcode = searchParams.get('barcode') || '';
  const manufacturingDate = searchParams.get('manufacturingDate') || '';

  const isVerified = result === 'verified' || result === 'likely_original';
  const statusText = isVerified ? 'LIKELY ORIGINAL' : result === 'fake' ? 'POSSIBLY FAKE' : 'PENDING';
  
  // Map API result to display format
  const displayResult = result === 'verified' ? 'likely_original' : result;
  
  // Set default tab based on method
  useEffect(() => {
    if (method === 'code') {
      setActiveTab('code');
    } else if (method === 'image') {
      setActiveTab('image');
    }
  }, [method]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verification Result</h1>
          <p className="text-sm sm:text-base text-gray-600">Analysis complete. See the detailed breakdown below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Panel - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 w-full">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 ${
                    isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {statusText}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {brand || 'Product Verification'}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {method === 'code' 
                      ? 'Product verified using code analysis.' 
                      : method === 'image'
                      ? 'Product image provided by user.'
                      : 'Verification complete.'}
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                      <span className="text-2xl font-bold text-gray-900">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on {method === 'code' ? 'code' : method === 'image' ? 'image' : 'verification'} analysis
                      {method === 'image' && !brand && (
                        <span className="block mt-1 text-yellow-600 font-medium">
                          ⚠️ Add brand and codes for better accuracy
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('image')}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'image'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Image Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'code'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Code Details
                  </button>
                  <button
                    onClick={() => setActiveTab('brand')}
                    className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === 'brand'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Brand Information
                  </button>
                </nav>
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === 'image' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Analysis</h3>
                    {method === 'image' ? (
                      <div>
                        {!brand && (
                          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Limited Analysis</h4>
                            <p className="text-sm text-yellow-800 mb-3">
                              Image-only verification provides basic analysis. For accurate authenticity detection:
                            </p>
                            <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                              <li>Select the brand from the dropdown</li>
                              <li>Enter batch number, serial number, and barcode</li>
                              <li>This enables pattern matching for precise verification</li>
                            </ul>
                          </div>
                        )}
                        {brand && !batchNumber && (
                          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Brand Selected</h4>
                            <p className="text-sm text-blue-800">
                              Brand <strong>{brand}</strong> is selected. Add product codes (batch, serial, barcode) for code pattern verification.
                            </p>
                          </div>
                        )}
                        <div className="space-y-3">
                          {['Image Quality Check', 'Packaging Analysis', 'Logo Detection', 'Text Quality'].map((indicator) => (
                            <div key={indicator} className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{indicator}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">No image analysis available. This verification was performed using code analysis.</p>
                    )}
                  </div>
                )}

                {activeTab === 'code' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Analysis</h3>
                    <div className="space-y-4">
                      {brand && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Brand</span>
                          <span className="font-medium text-gray-900">{brand}</span>
                        </div>
                      )}
                      {batchNumber && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Batch Number</span>
                          <span className="font-medium text-gray-900">{batchNumber}</span>
                        </div>
                      )}
                      {serialNumber && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Serial Number</span>
                          <span className="font-medium text-gray-900">{serialNumber}</span>
                        </div>
                      )}
                      {barcode && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Barcode</span>
                          <span className="font-medium text-gray-900">{barcode}</span>
                        </div>
                      )}
                      {manufacturingDate && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Manufacturing Date</span>
                          <span className="font-medium text-gray-900">
                            {new Date(manufacturingDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Verification Status</span>
                        <span className={`font-medium ${
                          result === 'verified' ? 'text-green-600' : 
                          result === 'fake' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {result === 'verified' ? 'Verified' : 
                           result === 'fake' ? 'Fake' : 
                           'Pending Review'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'brand' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h3>
                    {brand ? (
                      <>
                        <p className="text-gray-600 mb-4">
                          Information about {brand} will be displayed here when brand details are available.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Brand:</span>
                            <span className="text-gray-900 font-medium">{brand}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">No brand information available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Known Fake Signs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Known Fake Signs</h2>
              <div className="space-y-4">
                {[
                  'Poor quality printing, blurry text, or spelling mistakes on the label or packaging.',
                  'Unusually low price compared to authorized retailers.',
                  'Flimsy or ill-fitting packaging and cellophane wrap.',
                  'Unusual scent, color, or texture of the product itself.',
                  'Batch codes that are missing, printed poorly, or don\'t match the packaging.',
                ].map((sign, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">i</span>
                    </div>
                    <p className="text-sm text-gray-600">{sign}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => router.push('/verify-code')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Verification
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Save Report
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}

