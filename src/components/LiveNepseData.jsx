'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { useMarketData } from '../context/MarketDataContext';

const LiveNepseData = () => {
  const { liveData: homeData, liveDataLoading: loading, liveDataError: error, isMarketOpen } = useMarketData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play slider - useEffect must be at top level
  useEffect(() => {
    if (!homeData) return;
    
    const autoPlay = setInterval(() => {
      const totalSlides = homeData?.indices?.filter(i => i.symbol !== 'NEPSE').length || 0;
      if (totalSlides > 1) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(autoPlay);
  }, [homeData]);

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num?.toLocaleString() || '0';
  };

  const nextSlide = () => {
    if (!homeData) return;
    const otherIndices = homeData?.indices?.filter(i => i.symbol !== 'NEPSE') || [];
    const totalSlides = otherIndices.length;
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (!homeData) return;
    const otherIndices = homeData?.indices?.filter(i => i.symbol !== 'NEPSE') || [];
    const totalSlides = otherIndices.length;
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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

  if (loading && !homeData) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  // Extract main NEPSE index
  const nepseIndex = homeData?.indices?.find(i => i.symbol === 'NEPSE');
  const isPositive = nepseIndex?.change >= 0;

  // Use marketOpen from context
  const marketOpen = isMarketOpen;

  // Format the market time
  // Note: API returns Nepal local time but incorrectly marks it as UTC with 'Z' suffix
  // We need to treat it as local Nepal time, not UTC
  const formatMarketTime = () => {
    if (!homeData || !homeData.marketStatus || !homeData.marketStatus.time) return '';
    
    // Remove 'Z' suffix as the API is returning Nepal local time, not UTC
    const timeStr = homeData.marketStatus.time.replace('Z', '');
    const date = new Date(timeStr);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    return date.toLocaleString('en-US', options);
  };

  // Extract market summary
  const marketSummary = homeData?.marketSummary || [];
  const turnover = marketSummary.find(m => m.name.includes('Turnover'))?.value || 0;
  const shares = marketSummary.find(m => m.name.includes('Shares'))?.value || 0;
  const transactions = marketSummary.find(m => m.name.includes('Transactions'))?.value || 0;
  const scriptsTraded = marketSummary.find(m => m.name.includes('Scripts'))?.value || 0;

  // Extract stock summary
  const stockSummary = homeData?.stockSummary || {};

  // Get other indices for slider
  const otherIndices = homeData?.indices?.filter(i => i.symbol !== 'NEPSE') || [];
  
  // Create slider items with only indices (no market stats)
  const sliderItems = otherIndices.map(index => ({
    type: 'index',
    data: index
  }));

  return (
    <div className="space-y-6">
      {/* Main NEPSE Index Card */}
      <div className={`relative overflow-hidden rounded-xl border-2 p-4 md:p-6 ${
        isPositive 
          ? 'border-green-600 bg-white dark:bg-gray-800' 
          : 'border-red-600 bg-white dark:bg-gray-800'
      }`}>
        {/* Market Time and Status Indicator - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {/* Last Updated Time - Below on mobile, Left on desktop */}
          {homeData && homeData.marketStatus && homeData.marketStatus.time && (
            <div className="order-2 sm:order-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm bg-gray-100/90 dark:bg-gray-700/90 shadow-lg">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {formatMarketTime()}
              </span>
            </div>
          )}
          
          {/* Market Status - Top on mobile, Right on desktop */}
          <div className={`order-1 sm:order-2 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            marketOpen 
              ? 'bg-green-500/90 hover:bg-green-500 shadow-lg shadow-green-500/30' 
              : 'bg-gray-500/90 hover:bg-gray-500 shadow-lg shadow-gray-500/30'
          }`}>
            {marketOpen ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Open</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white/80"></span>
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Closed</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side: NEPSE Index Info and Value */}
          <div className="flex-shrink-0">
            {/* Header with NEPSE Index Info */}
            <div className="flex items-center space-x-2 md:space-x-3 mb-3">
              <div className={`p-1.5 md:p-2 rounded-lg ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}>
                <ChartBarIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">NEPSE Index</h3>
                <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Nepal Stock Exchange</p>
              </div>
            </div>

            {/* Index Value and Change */}
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {nepseIndex?.currentValue?.toFixed(2) || '0.00'}
              </div>
              <div className={`flex items-center space-x-1 md:space-x-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 md:h-5 md:w-5" />
                )}
                <span className="text-lg md:text-xl font-bold">
                  {isPositive ? '+' : ''}{nepseIndex?.change?.toFixed(2) || '0.00'}
                </span>
                <span className="text-lg md:text-xl font-bold">
                  ({isPositive ? '+' : ''}{nepseIndex?.changePercent?.toFixed(2) || '0.00'}%)
                </span>
              </div>
            </div>

            {/* Mobile/Tablet - Market Statistics Above Stock Summary */}
            <div className="lg:hidden mt-4 space-y-3">
              {/* Market Statistics Block - Merged */}
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="p-1.5 bg-blue-100 rounded mb-2">
                      <BanknotesIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">Turnover</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(turnover)}</p>
                  </div>

                  <div className="h-12 w-px bg-gray-300 mx-2"></div>

                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="p-1.5 bg-purple-100 rounded mb-2">
                      <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">Shares</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(shares)}</p>
                  </div>

                  <div className="h-12 w-px bg-gray-300 mx-2"></div>

                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="p-1.5 bg-orange-100 rounded mb-2">
                      <ArrowPathIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">Transactions</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(transactions)}</p>
                  </div>
                </div>
              </div>
              
              {/* Stock Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-around space-x-3">
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Advanced</p>
                    <p className="text-2xl font-bold text-green-600">{stockSummary.advanced || 0}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2">
                      <div className="p-1.5 bg-red-100 rounded">
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Declined</p>
                    <p className="text-2xl font-bold text-red-600">{stockSummary.declined || 0}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="text-center flex-1">
                    <div className="flex justify-center mb-2">
                      <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded">
                        <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Unchanged</p>
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stockSummary.unchanged || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Other Indices - Desktop Only */}
          <div className="hidden lg:flex flex-col gap-2 self-center">
            {homeData?.indices && homeData.indices.slice(1).map((index, i) => {
              const indexPositive = index.change >= 0;
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all min-w-[180px]">
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">{index.name}</p>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-base font-bold text-gray-900 dark:text-white">{index.currentValue?.toFixed(2)}</p>
                    <div className={`text-xs font-semibold ${indexPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {indexPositive ? '+' : ''}{index.change?.toFixed(2)} ({indexPositive ? '+' : ''}{index.changePercent?.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: All Statistics in 2 Rows - Desktop Only */}
          <div className="hidden lg:flex flex-col justify-center rounded-lg gap-3 min-w-[600px]">
            {/* Row 1: Market Statistics - Merged */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm">
                  <BanknotesIcon className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Turnover</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white"><span className="inline-block">रु {formatNumber(turnover)}</span></p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-3"></div>

              <div className="flex items-center gap-2 flex-1">
                <div className="p-1.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-sm">
                  <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Shares</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(shares)}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-3"></div>

              <div className="flex items-center gap-2 flex-1">
                <div className="p-1.5 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg shadow-sm">
                  <ArrowPathIcon className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Transactions</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(transactions)}</p>
                </div>
              </div>
            </div>

            {/* Row 2: Stock Summary - Merged */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <div className="text-center flex-1">
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">Advanced</p>
                <p className="text-xl font-bold text-green-600">{stockSummary.advanced || 0}</p>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-3"></div>

              <div className="text-center flex-1">
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">Declined</p>
                <p className="text-xl font-bold text-red-600">{stockSummary.declined || 0}</p>
              </div>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-3"></div>

              <div className="text-center flex-1">
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-1">Unchanged</p>
                <p className="text-xl font-bold text-gray-400">{stockSummary.unchanged || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Statistics - Mobile Slider / Desktop Bar */}
      {/* Mobile Slider */}
      <div className="md:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative">
          {/* Slider Content */}
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sliderItems.map((item, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">{item.data.name}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{item.data.currentValue?.toFixed(2)}</p>
                    </div>
                    <div className={`text-right ${item.data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <p className="text-sm font-semibold">{item.data.change >= 0 ? '+' : ''}{item.data.change?.toFixed(2)}</p>
                      <p className="text-xs font-semibold">({item.data.change >= 0 ? '+' : ''}{item.data.changePercent?.toFixed(2)}%)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {sliderItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNepseData;
