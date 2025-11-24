'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, SunIcon, MoonIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';
import { useMarketData } from '../context/MarketDataContext';

const Navbar = ({ onSearchClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { refreshLiveData, refreshAllStocks, isMarketOpen } = useMarketData();
  const [showSearch, setShowSearch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearchClick = () => {
    setShowSearch(true);
    // Scroll to All Stocks section
    const allStocksSection = document.getElementById('all-stocks');
    if (allStocksSection) {
      allStocksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus on search input after scroll
      setTimeout(() => {
        const searchInput = allStocksSection.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
        }
      }, 500);
    }
  };

  const handleUniversalRefresh = async () => {
    setIsRefreshing(true);
    // Refresh both live data and all stocks simultaneously
    await Promise.all([
      refreshLiveData(),
      refreshAllStocks()
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <nav className="sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SharePulse</h1>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Real-time Market Tracker</p>
            </div>
          </div>

          {/* Right Side - Universal Refresh, Search and Theme Toggle */}
          <div className="flex items-center space-x-2">
            {/* Universal Refresh Button */}
            <button 
              onClick={handleUniversalRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg transition-all focus:outline-none ${
                isRefreshing
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60 hover:scale-105 active:scale-95 backdrop-blur-sm'
              }`}
              title="Refresh all market data"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Search Button */}
            <button 
              onClick={handleSearchClick}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60 hover:scale-105 active:scale-95 backdrop-blur-sm transition-all focus:outline-none"
              title="Search stocks"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

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
          </div>
        </div>
      </div>

      </div>
    </nav>
  );
};

export default Navbar;
