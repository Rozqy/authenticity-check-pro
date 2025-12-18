'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAdmin) {
    return null; // Admin pages have their own header
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900">Authenticity Check Pro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Home
            </Link>
            <Link href="/verify-code" className={`text-sm font-medium ${pathname === '/verify-code' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Verify Product
            </Link>
            <Link href="/brands" className={`text-sm font-medium ${pathname === '/brands' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Brands
            </Link>
            <Link href="/history" className={`text-sm font-medium ${pathname === '/history' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              History
            </Link>
            <Link href="/account" className={`text-sm font-medium ${pathname === '/account' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              Account
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Log In
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-2">
              Log In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium ${pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Home
              </Link>
              <Link 
                href="/verify-code" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium ${pathname === '/verify-code' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Verify Product
              </Link>
              <Link 
                href="/brands" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium ${pathname === '/brands' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Brands
              </Link>
              <Link 
                href="/history" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium ${pathname === '/history' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                History
              </Link>
              <Link 
                href="/account" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium ${pathname === '/account' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Account
              </Link>
              <div className="pt-2 border-t border-gray-200">
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-center"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

