'use client';

import { useEffect, useState } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CubeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolidIcon } from '@heroicons/react/24/solid';
import { getCurrentMarketPhase, MARKET_PHASES } from '@/utils/marketPhases';
import api from '@/services/api';

const CompanyOverview = ({ symbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const phase = getCurrentMarketPhase();
        
        // Try to get cached data first for immediate display
        const cached = localStorage.getItem(`company_overview_${symbol}`);
        const cachedData = cached ? JSON.parse(cached) : null;
        
        // Always try to fetch fresh data
        const response = await api.getCompanyOverview(symbol);
        const freshData = response.data;
        setData(freshData);
        
        // Cache the data for offline/closed market use
        localStorage.setItem(`company_overview_${symbol}`, JSON.stringify(freshData));
      } catch (err) {
        console.log('Fetch failed, trying cached data');
        // Try cached data on error
        const cached = localStorage.getItem(`company_overview_${symbol}`);
        if (cached) {
          setData(JSON.parse(cached));
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    const saved = localStorage.getItem('nepse_watchlist');
    if (saved) {
      const symbols = JSON.parse(saved);
      setIsInWatchlist(symbols.includes(symbol));
    }
  }, [symbol]);

  const toggleWatchlist = () => {
    const saved = localStorage.getItem('nepse_watchlist');
    let symbols = saved ? JSON.parse(saved) : [];
    
    if (symbols.includes(symbol)) {
      symbols = symbols.filter(s => s !== symbol);
    } else {
      symbols.push(symbol);
    }
    
    localStorage.setItem('nepse_watchlist', JSON.stringify(symbols));
    setIsInWatchlist(symbols.includes(symbol));
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-NP').format(num);
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '-';
    return new Intl.NumberFormat('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">Failed to load overview data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isPositive = data.change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {data.iconUrl ? (
            <img
              src={`https://cdn.arthakendra.com/${data.iconUrl}`}
              alt={data.symbol}
              className="w-16 h-16 rounded-xl object-contain border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-1"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.symbol)}&background=3B82F6&color=fff&size=128&bold=true&font-size=0.4`;
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {data.symbol?.substring(0, 2)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {data.symbol}
              </h1>
              <button
                onClick={toggleWatchlist}
                className={`p-1.5 rounded-full transition-colors ${
                  isInWatchlist
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-blue-500'
                }`}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isInWatchlist ? (
                  <EyeSolidIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {data.securityName}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Sector: {data.sector || 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="text-left md:text-right">
          <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Rs. {formatCurrency(data.lastTradedPrice)}
          </div>
          <div className={`flex items-center gap-2 mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="h-5 w-5" />
            ) : (
              <ArrowTrendingDownIcon className="h-5 w-5" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{formatNumber(data.change)} ({isPositive ? '+' : ''}{data.percentageChange?.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-700 dark:text-green-400 font-medium">High</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Rs. {formatCurrency(data.highPrice)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs text-red-700 dark:text-red-400 font-medium">Low</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Rs. {formatCurrency(data.lowPrice)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <CubeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">Volume</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(data.totalTradeQuantity)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-700 dark:text-purple-400 font-medium">Trades</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(data.totalTransactions)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
