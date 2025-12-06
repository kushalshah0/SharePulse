'use client';

import React, { useMemo } from 'react';
import { useMarketData } from '@/context/MarketDataContext';

const StockMarquee = () => {
  const { allStocks, allStocksLoading } = useMarketData();

  // Select random stocks for marquee (or use top movers)
  const marqueeStocks = useMemo(() => {
    if (!allStocks || allStocks.length === 0) return [];
    
    // Filter stocks with valid data and change percentage
    const validStocks = allStocks.filter(stock => 
      stock.symbol && 
      stock.lastTradedPrice && 
      stock.percentageChange !== undefined &&
      stock.percentageChange !== null
    );

    // Get a diverse mix: sort by absolute percentage change and take top movers
    const sortedByChange = [...validStocks].sort((a, b) => 
      Math.abs(parseFloat(b.percentageChange) || 0) - Math.abs(parseFloat(a.percentageChange) || 0)
    );

    // Take top 12 stocks with biggest movements
    return sortedByChange.slice(0, 12);
  }, [allStocks]);

  if (allStocksLoading) {
    // Skeleton loader for marquee
    return (
      <div className="px-4 sm:px-6 lg:px-8 mb-3">
        <div className="relative overflow-hidden max-w-7xl mx-auto">
          <div className="py-2 flex">
            <div className="flex items-center space-x-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2 shadow-lg flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (marqueeStocks.length === 0) {
    return null; // Don't show marquee if no data
  }

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return num ? num.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
  };

  const formatChange = (change) => {
    const num = parseFloat(change);
    if (isNaN(num)) return '0.0%';
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const StockCard = ({ stock }) => {
    const change = parseFloat(stock.percentageChange) || 0;
    const isPositive = change > 0;
    const isNegative = change < 0;

    return (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl px-4 py-2 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-gray-900 dark:text-white font-bold text-sm">
            {stock.symbol}
          </span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {formatPrice(stock.lastTradedPrice)}
          </span>
          {isPositive && (
            <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
              {formatChange(stock.percentageChange)}
            </span>
          )}
          {isNegative && (
            <span className="text-red-600 dark:text-red-400 text-xs font-bold bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
              {formatChange(stock.percentageChange)}
            </span>
          )}
          {!isPositive && !isNegative && (
            <span className="text-gray-600 dark:text-gray-400 text-xs font-bold bg-gray-100 dark:bg-gray-700/40 px-2 py-0.5 rounded-full">
              0.0%
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-3">
      <div className="relative overflow-hidden max-w-7xl mx-auto">
        <div className="py-2 flex">
          <div className="flex items-center space-x-4 animate-marquee-continuous">
            {/* First set of stocks */}
            {marqueeStocks.map((stock, index) => (
              <StockCard key={`first-${stock.symbol}-${index}`} stock={stock} />
            ))}
            {/* Duplicate set for seamless loop */}
            {marqueeStocks.map((stock, index) => (
              <StockCard key={`second-${stock.symbol}-${index}`} stock={stock} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMarquee;
