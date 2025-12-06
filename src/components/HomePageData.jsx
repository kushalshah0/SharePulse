'use client';

import React from 'react';
import { 
  TrophyIcon, 
  ArrowTrendingDownIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import { useMarketData } from '../context/MarketDataContext';

const HomePageData = () => {
  const { liveData: homeData, liveDataLoading: loading, liveDataError: error } = useMarketData();

  if (loading && !homeData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Market Movers</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Top performing stocks</p>
        </div>

        {/* Top Gainers Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-white" />
            <h3 className="text-base font-bold text-white flex-1">Top Gainers</h3>
            <FireIcon className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="text-xs font-bold text-gray-400 w-5">#{i}</span>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="space-y-1 text-right flex-shrink-0">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto animate-pulse"></div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Losers Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 flex items-center gap-2">
            <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
            <h3 className="text-base font-bold text-white flex-1">Top Losers</h3>
            <SparklesIcon className="h-4 w-4 text-white" />
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="text-xs font-bold text-gray-400 w-5">#{i}</span>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="space-y-1 text-right flex-shrink-0">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto animate-pulse"></div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

  const topGainers = homeData?.topGainers || [];
  const topLosers = homeData?.topLosers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Market Movers</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Top performing stocks</p>
      </div>

      {/* Top Gainers Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-white" />
          <h3 className="text-base font-bold text-white flex-1">Top Gainers</h3>
          <FireIcon className="h-4 w-4 text-white animate-pulse" />
        </div>
        <div className="p-3">
          {topGainers.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No data</p>
          ) : (
            <div className="space-y-2">
              {topGainers.slice(0, 5).map((stock, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-gray-400 w-5">#{index + 1}</span>
                  {stock.icon ? (
                    <img 
                      src={stock.icon.startsWith('http') ? stock.icon : `https://cdn.arthakendra.com/${stock.icon}`} 
                      alt={stock.symbol}
                      className="w-8 h-8 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=10B981&color=fff&size=64&bold=true&font-size=0.4`;
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      {stock?.symbol?.substring(0, 2) || '??'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{stock.symbol}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400"><span className="inline-block">रु {stock.lastTradedPrice?.toFixed(2)}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600">+{stock.changePercent?.toFixed(2)}%</p>
                    <p className="text-[10px] text-gray-500">+{stock.change?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Losers Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 flex items-center gap-2">
          <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
          <h3 className="text-base font-bold text-white flex-1">Top Losers</h3>
          <SparklesIcon className="h-4 w-4 text-white" />
        </div>
        <div className="p-3">
          {topLosers.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No data</p>
          ) : (
            <div className="space-y-2">
              {topLosers.slice(0, 5).map((stock, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-gray-400 w-5">#{index + 1}</span>
                  {stock.icon ? (
                    <img 
                      src={stock.icon.startsWith('http') ? stock.icon : `https://cdn.arthakendra.com/${stock.icon}`} 
                      alt={stock.symbol}
                      className="w-8 h-8 rounded-lg object-contain border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stock.symbol)}&background=EF4444&color=fff&size=64&bold=true&font-size=0.4`;
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-xs">
                      {stock?.symbol?.substring(0, 2) || '??'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{stock.symbol}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400"><span className="inline-block">रु {stock.lastTradedPrice?.toFixed(2)}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-red-600">{stock.changePercent?.toFixed(2)}%</p>
                    <p className="text-[10px] text-gray-500">{stock.change?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageData;
