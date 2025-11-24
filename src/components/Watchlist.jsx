'use client';

import React, { useState, useEffect } from 'react';
import { 
  HeartIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useMarketData } from '../context/MarketDataContext';

const Watchlist = () => {
  const { allStocks, allStocksLoading: loading } = useMarketData();
  const [watchlist, setWatchlist] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    // Load watchlist from localStorage
    const saved = localStorage.getItem('nepse_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  // Update watchlist data when allStocks changes
  useEffect(() => {
    if (allStocks && allStocks.length > 0) {
      const saved = localStorage.getItem('nepse_watchlist');
      if (!saved) return;
      
      const savedSymbols = JSON.parse(saved);
      const updatedWatchlist = savedSymbols
        .map(symbol => allStocks.find(s => s.symbol === symbol))
        .filter(Boolean);
      
      setWatchlist(updatedWatchlist);
    }
  }, [allStocks]);

  // Auto-play carousel - REMOVED for mobile

  const addToWatchlist = (stock) => {
    const symbols = [...watchlist.map(s => s.symbol), stock.symbol];
    localStorage.setItem('nepse_watchlist', JSON.stringify(symbols));
    setWatchlist([...watchlist, stock]);
    setShowAddModal(false);
    setSearchTerm('');
  };

  const removeFromWatchlist = (symbol) => {
    const newWatchlist = watchlist.filter(s => s.symbol !== symbol);
    const symbols = newWatchlist.map(s => s.symbol);
    localStorage.setItem('nepse_watchlist', JSON.stringify(symbols));
    setWatchlist(newWatchlist);
  };

  const isInWatchlist = (symbol) => {
    return watchlist.some(s => s.symbol === symbol);
  };

  const nextSlide = () => {
    if (watchlist.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % watchlist.length);
    }
  };

  const prevSlide = () => {
    if (watchlist.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + watchlist.length) % watchlist.length);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const filteredStocks = allStocks.filter(stock => 
    !isInWatchlist(stock.symbol) && (
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stock.securityName && stock.securityName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  return (
    <div className="space-y-4">
      {/* Watchlist Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg">
            <HeartSolidIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">My Watchlist</h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Track your favorite stocks</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-3 md:px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-xs md:text-sm font-semibold">Add Stock</span>
        </button>
      </div>

      {/* Watchlist Content */}
      {watchlist.length === 0 ? (
        <div className="card text-center py-12">
          <HeartIcon className="h-16 w-16 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">Your watchlist is empty</p>
          <p className="text-gray-600 dark:text-gray-500 text-sm mb-4">Add stocks to track their performance</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-semibold">Add Your First Stock</span>
          </button>
        </div>
      ) : (
        <div>
          {/* Mobile: Carousel, Desktop: Linear Grid */}
          <div className="md:hidden">
            {/* Mobile Carousel */}
            <div 
              className="overflow-hidden rounded-xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {watchlist.filter(stock => stock && stock.symbol).map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <div 
                      key={stock.symbol}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md">
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromWatchlist(stock.symbol)}
                          className="absolute top-3 right-3 p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full transition-colors z-10"
                          title="Remove from watchlist"
                        >
                          <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </button>

                        <div className="flex items-start gap-3">
                          {/* Logo */}
                          <div className="flex-shrink-0">
                            <img 
                              src={(stock.iconUrl || stock.icon) ? `https://cdn.arthakendra.com/${stock.iconUrl || stock.icon}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EC4899&color=fff&size=64&bold=true&font-size=0.4`} 
                              alt={stock.symbol}
                              className="w-12 h-12 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1.5"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EC4899&color=fff&size=64&bold=true&font-size=0.4`;
                              }}
                              loading="lazy"
                            />
                          </div>

                          {/* Stock Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">{stock.symbol}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-snug">{stock.securityName || stock.name || ''}</p>

                            {/* Price and Change */}
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <div className="text-base font-bold text-gray-900 dark:text-white">
                                रु {stock.lastTradedPrice?.toFixed(2)}
                              </div>
                              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-sm font-semibold whitespace-nowrap ${
                                isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              }`}>
                                <span>{isPositive ? '▲' : '▼'}</span>
                                <span>{isPositive ? '+' : ''}{(stock.percentageChange || stock.changePercent)?.toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile Navigation Dots */}
            {watchlist.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {watchlist.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-8 bg-pink-600' : 'w-2 bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Linear Horizontal Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {watchlist.filter(stock => stock && stock.symbol).map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <div 
                  key={stock.symbol}
                  className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className="absolute top-3 right-3 p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full transition-colors z-10"
                    title="Remove from watchlist"
                  >
                    <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </button>

                  <div className="flex items-start gap-3">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <img 
                        src={(stock.iconUrl || stock.icon) ? `https://cdn.arthakendra.com/${stock.iconUrl || stock.icon}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EC4899&color=fff&size=64&bold=true&font-size=0.4`} 
                        alt={stock.symbol}
                        className="w-12 h-12 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1.5"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EC4899&color=fff&size=64&bold=true&font-size=0.4`;
                        }}
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Stock Info, Price and Change */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">{stock.symbol}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-snug">{stock.securityName || stock.name || ''}</p>
                      
                      {/* Price and Change */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <div className="text-base font-bold text-gray-900 dark:text-white">
                          रु {stock.lastTradedPrice?.toFixed(2)}
                        </div>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-sm font-semibold whitespace-nowrap ${
                          isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          <span>{isPositive ? '▲' : '▼'}</span>
                          <span>{isPositive ? '+' : ''}{(stock.percentageChange || stock.changePercent)?.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              setSearchTerm('');
            }
          }}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                  <PlusIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add to Watchlist</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Search and add stocks to track</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchTerm('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-5 bg-gray-50 dark:bg-gray-900/50">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search stocks by symbol or company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-shadow"
                  autoFocus
                />
              </div>
              {searchTerm && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Found {filteredStocks.length} stock{filteredStocks.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Stock List */}
            <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-5">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin h-10 w-10 border-3 border-pink-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Loading stocks...</p>
                </div>
              ) : filteredStocks.length === 0 ? (
                <div className="text-center py-16">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No stocks found</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredStocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <button
                        key={stock.symbol}
                        onClick={() => addToWatchlist(stock)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all text-left border border-transparent hover:border-gray-200 dark:hover:border-gray-600 group"
                      >
                        {/* Logo */}
                        <img 
                          src={(stock.iconUrl || stock.icon) ? `https://cdn.arthakendra.com/${stock.iconUrl || stock.icon}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EC4899&color=fff&size=64&bold=true&font-size=0.4`} 
                          alt={stock.symbol}
                          className="w-10 h-10 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EC4899&color=fff&size=64&bold=true&font-size=0.4`;
                          }}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{stock.symbol}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stock.securityName || stock.name || ''}</p>
                        </div>

                        {/* Price & Change */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">रु {stock.lastTradedPrice?.toFixed(2)}</p>
                          <p className={`text-xs font-semibold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                            {isPositive ? '+' : ''}{(stock.percentageChange || stock.changePercent)?.toFixed(2)}%
                          </p>
                        </div>

                        {/* Add Icon */}
                        <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                          <PlusIcon className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
