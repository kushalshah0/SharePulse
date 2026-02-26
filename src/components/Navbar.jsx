'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useMarketData } from '../context/MarketDataContext';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { allStocks } = useMarketData();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.length > 0 && allStocks) {
      const filtered = allStocks.filter(stock => 
        stock.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.securityName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, allStocks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectStock = (symbol) => {
    setSearchQuery('');
    setShowResults(false);
    router.push(`/company/${symbol}`);
  };

  return (
    <nav className="sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">SharePulse</h1>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Real-time Market Tracker</p>
              </Link>
            </div>
          </div>

          {/* Right Side - Search, Floorsheet and Theme Toggle */}
          <div className="flex items-center space-x-2">
            {/* Search Bar */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                  className="w-48 lg:w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-lg outline-none transition-all"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                  {searchResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleSelectStock(stock.symbol)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{stock.securityName}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Rs. {stock.lastTradedPrice?.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Floorsheet Link - Desktop */}
            <Link 
              href="/nepse/floorsheet" 
              className="hidden md:block px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60 rounded-lg transition-all"
            >
              Floorsheet
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60 hover:scale-105 active:scale-95 backdrop-blur-sm transition-all focus:outline-none"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60 rounded-lg transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Search */}
            <div className="px-4 py-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 rounded-lg outline-none transition-all"
                />
              </div>
              {showResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  {searchResults.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        handleSelectStock(stock.symbol);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{stock.securityName}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Rs. {stock.lastTradedPrice?.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/nepse/floorsheet"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                Floorsheet
              </Link>
            </div>
          </div>
        )}
      </div>

      </div>
    </nav>
  );
};

export default Navbar;
