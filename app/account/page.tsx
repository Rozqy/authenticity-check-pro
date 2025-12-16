'use client';

import Header from '@/components/Header';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">Account settings will appear here.</p>
        </div>
      </main>
    </div>
  );
}




